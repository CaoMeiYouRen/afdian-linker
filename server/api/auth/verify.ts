import jwt from 'jsonwebtoken'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/entities/User'
import { SESSION_KEY } from '@/server/utils/session'

export default defineEventHandler(async (event) => {
    try {
        const token = getCookie(event, SESSION_KEY)
        if (!token) {
            throw createError({
                statusCode: 401,
                message: '未登录',
            })
        }

        const config = useRuntimeConfig()
        const decoded = jwt.verify(token, config.jwtSecret) as { id: string }

        const dataSource = await getDataSource()
        const userRepo = dataSource.getRepository(User)
        const user = await userRepo.findOneBy({ id: decoded.id })

        if (!user) {
            throw createError({
                statusCode: 401,
                message: '用户不存在',
            })
        }

        return {
            success: true,
            data: {
                username: user.username,
                nickname: user.nickname,
                email: user.email,
                role: user.role,
                initialPassword: user.initialPassword,
                initialEmail: user.initialEmail,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                id: user.id,
            },
        }
    } catch (error) {
        throw createError({
            statusCode: 401,
            message: '登录已过期',
        })
    }
})
