import type { EventHandler } from 'h3'
import { z } from 'zod'
import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SESSION_KEY, setSession } from '@/server/utils/session'
import { rateLimit } from '@/server/utils/rate-limit'
import { getDataSource } from '@/server/utils/database'
import { User, UserRole } from '@/server/entities/user'
import { ApiResponse, createApiResponse } from '@/server/types/api'

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

        const user = await userRepo.createQueryBuilder('user')
            .where({
                username: body.username,
            })
            .addSelect('user.password') // 手动选择密码字段，否则没有该字段
            .getOne()

        // 验证用户存在性
        if (!user) {
            throw createError({
                statusCode: 401,
            })
        }
        // 验证密码
        const passwordValid = await compare(body.password, user.password)
        if (!passwordValid) {
            throw createError({
                statusCode: 401,
                message: '密码错误',
            })
        }

        // 验证管理员权限
        // if (user.role !== UserRole.ADMIN) {
        //     throw createError({
        //         statusCode: 403,
        //         message: '仅限管理员登录',
        //     })
        // }

        // JWT 令牌生成
        const token = setSession(event, {
            id: user.id,
            role: user.role,
        })

        return createApiResponse({
            requirePasswordChange: user.initialPassword,
            requireEmailChange: user.initialEmail,
            requireEmailVerification: user.emailVerified,
            token,
        })
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
