import jwt from 'jsonwebtoken'
import { getSession, SESSION_KEY } from '@/server/utils/session'

export default defineEventHandler(async (event) => {
    // 白名单路径
    const publicPaths = [
        '/api/auth/login',
        '/api/public',
    ]
    if (publicPaths.some((path) => event.path.startsWith(path))) {
        return
    }

    const token = getCookie(event, SESSION_KEY)
    if (!token) {
        throw createError({
            statusCode: 401,
            message: '请先登录',
        })
    }

    try {
        const config = useRuntimeConfig()
        const decoded = jwt.verify(token, config.jwtSecret) as { id: string, role: string }

        // 管理员路由权限验证
        if ((event.path.startsWith('/api/admin') || event.path.startsWith('/admin')) && decoded.role !== 'ADMIN') {
            throw createError({
                statusCode: 403,
                message: '需要管理员权限',
            })
        }

        event.context.auth = decoded
    } catch (error) {
        throw createError({
            statusCode: 401,
            message: '登录已过期',
        })
    }
})
