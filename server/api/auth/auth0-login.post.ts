import crypto from 'crypto'
import { readBody } from 'h3'
import jwt from 'jsonwebtoken'
import { JwksClient } from 'jwks-rsa'
import { z } from 'zod'
import { getDataSource } from '@/server/utils/database'
import { User, UserRole } from '@/server/entities/user'
import { createApiResponse } from '@/server/types/api'
import { createSyntheticEmail, getVerifiedOAuthEmail } from '@/server/utils/oauth'
import { setAuthSession } from '@/server/utils/session'
import type { JwtPayload } from '@/server/types/auth0'

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
        const { token } = schema.parse(await readBody(event))
        if (!token) {
            throw createError({ statusCode: 400, message: '缺少token' })
        }

        // 验证 Auth0 的 id_token 或 access_token
        const payload: JwtPayload = await validateJwt(token)
        if (!payload.sub) {
            throw createError({ statusCode: 401, message: '无效的 Auth0 身份' })
        }

        // decoded.sub 作为唯一标识
        const dataSource = await getDataSource()
        const userRepo = dataSource.getRepository(User)

        // 只有 Auth0 明确验证过的邮箱才可用于匹配/绑定已有账号
        // 未验证邮箱可能属于他人，直接绑定会造成账号接管
        const verifiedEmail = getVerifiedOAuthEmail({
            email: payload.email,
            email_verified: payload.email_verified,
        })

        // 仅按 auth0Id 查找；已验证邮箱才允许匹配已有账号
        let user = await userRepo.findOneBy({ auth0Id: payload.sub })
        if (!user && verifiedEmail) {
            user = await userRepo.findOneBy({ email: verifiedEmail })
        }

        if (!user) {
            // 注册新用户
            user = userRepo.create({
                auth0Id: payload.sub,
                // 未验证邮箱不能写入账号邮箱，使用占位邮箱避免占用/冒用他人邮箱
                email: verifiedEmail || createSyntheticEmail('auth0', payload.sub, 'auth0.local'),
                username: payload.name || payload.nickname || payload.email || payload.sub,
                nickname: payload.nickname || payload.name || verifiedEmail || '用户',
                emailVerified: !!verifiedEmail,
                initialEmail: !verifiedEmail,
                initialPassword: true, // 通过第三方注册的用户需要修改初始密码
                password: crypto.randomBytes(16).toString('hex'), // 随机生成一个密码
                role: UserRole.USER,

            })
            await userRepo.save(user)
        } else if (user.auth0Id !== payload.sub) {
            // 通过已验证邮箱匹配到已有账号
            if (user.auth0Id) {
                // 该邮箱已绑定其他 Auth0 身份，拒绝自动登录，避免账号接管
                throw createError({
                    statusCode: 409,
                    message: '该邮箱已绑定其他第三方账号，请使用原登录方式',
                })
            }
            // 如果未绑定 auth0Id，但邮箱已验证且相同，则绑定 auth0Id
            user.auth0Id = payload.sub
            if (verifiedEmail) {
                user.emailVerified = true
            }
            await userRepo.save(user)
        } else if (verifiedEmail && user.email === verifiedEmail && (!user.emailVerified)) {
            // 如果用户未验证邮箱，且 Auth0 已验证同一邮箱，则更新邮箱验证状态
            user.emailVerified = true
            await userRepo.save(user)
        }

        const jwtToken = setAuthSession(event, {
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
