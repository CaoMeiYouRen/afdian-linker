import type { EventHandler } from 'h3'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { rateLimit } from '@/server/utils/rateLimit'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/entities/User'

const loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
})

export default defineEventHandler(async (event) => {
    try {
        // 登录限流
        await rateLimit(event, {
            window: 60_000,
            max: 5,
        })

        const body = await readValidatedBody(event, loginSchema.parse)
        const dataSource = await getDataSource()
        const userRepo = dataSource.getRepository(User)

        const user = await userRepo.findOne({
            where: { username: body.username },
            select: ['id', 'password_hash', 'role', 'initial_password'],
        })

        // 验证用户存在性
        if (!user) {
            throw createError({
                statusCode: 401,
                message: '用户不存在',
            })
        }

        // 验证密码
        const passwordValid = await bcrypt.compare(body.password, user.password_hash)
        if (!passwordValid) {
            throw createError({
                statusCode: 401,
                message: '密码错误',
            })
        }

        // 验证管理员权限
        if (user.role !== 'ADMIN') {
            throw createError({
                statusCode: 403,
                message: '仅限管理员登录',
            })
        }

        // JWT 令牌生成
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            useRuntimeConfig().jwtSecret,
            { expiresIn: '24h' },
        )

        setCookie(event, 'auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400,
        })

        return {
            success: true,
            requirePasswordChange: user.initial_password,
            token,
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                message: '输入格式验证失败',
                data: error.issues,
            })
        }
        throw error
    }
})
