import crypto from 'crypto'
import { defineEventHandler, readBody } from 'h3'
import jwt from 'jsonwebtoken'
import { JwksClient } from 'jwks-rsa'
import { z } from 'zod'
import { getDataSource } from '@/server/utils/database'
import { User, UserRole } from '@/server/entities/user'
import { createApiResponse } from '@/server/types/api'
import { JwtPayload } from '@/server/types/auth0'
import { rateLimit } from '@/server/utils/rate-limit'

const AUTH0_DOMAIN = process.env.VITE_AUTH0_DOMAIN || 'YOUR_AUTH0_DOMAIN'

const jwksClient = new JwksClient({
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
})

async function getSigningKey(kid: string): Promise<string> {
    const key = await jwksClient.getSigningKey(kid)
    return key.getPublicKey()
}

/**
 *
 * 校验 auth0 jwt
 * @author CaoMeiYouRen
 * @date 2024-10-14
 * @export
 * @param token
 */
export async function validateJwt(token: string): Promise<any> {
    const decodedToken = jwt.decode(token, { complete: true })
    if (!decodedToken) {
        throw new Error('Invalid token')
    }

    const kid = decodedToken.header.kid || ''
    const publicKey = await getSigningKey(kid)

    return new Promise((resolve, reject) => {
        jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                reject(err)
                return
            }
            resolve(decoded)
        })
    })
}

const schema = z.object({
    token: z.string().min(1).max(2048),
})

export default defineEventHandler(async (event) => {
    try {
        // 登录限流
        await rateLimit(event, {
            window: 60_000,
            max: 5,
        })

        const { token } = schema.parse(await readBody(event))
        if (!token) {
            throw createError({ statusCode: 400, message: '缺少token' })
        }

        // 验证 Auth0 的 id_token 或 access_token
        const payload: JwtPayload = await validateJwt(token)

        // decoded.sub 作为唯一标识
        const dataSource = await getDataSource()
        const userRepo = dataSource.getRepository(User)
        // 先根据 auth0Id 查找用户，如果没有再根据 email 查找用户。
        let user = await userRepo.findOneBy([{ auth0Id: payload.sub }, { email: payload.email }])
        if (!user) {
            // 注册新用户
            user = userRepo.create({
                auth0Id: payload.sub,
                email: payload.email,
                username: payload.name,
                nickname: payload.nickname || payload.name || payload.email,
                emailVerified: payload.email_verified,
                initialEmail: !payload.email_verified,
                initialPassword: true, // 通过第三方注册的用户需要修改初始密码
                password: crypto.randomBytes(16).toString('hex'), // 随机生成一个密码
                role: UserRole.USER,

            })
            await userRepo.save(user)
        }
        // 如果未绑定 auth0Id，但 email 相同，则绑定 auth0Id。
        if (!user.auth0Id && user.email === payload.email) {
            user.auth0Id = payload.sub
            await userRepo.save(user)
        }
        // 如果用户未验证邮箱，则更新邮箱验证状态
        if (user.email === payload.email && (!user.emailVerified && payload.email_verified)) {
            user.emailVerified = payload.email_verified
            await userRepo.save(user)
        }

        const jwtToken = setSession(event, {
            id: user.id,
            role: user.role,
        })

        return createApiResponse({
            requirePasswordChange: user.initialPassword,
            requireEmailChange: user.initialEmail,
            requireEmailVerification: user.emailVerified,
            token: jwtToken,
        }, 200, '登录成功')
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                message: error.issues.map((e) => e.message).join(', '),
                data: error.issues,
            })
        }
        throw error
    }
})
