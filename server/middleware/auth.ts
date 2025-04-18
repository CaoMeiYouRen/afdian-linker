import jwt from 'jsonwebtoken'
import { getSession, SESSION_KEY } from '@/server/utils/session'

export default defineEventHandler(async (event) => {
    // 白名单路径
    const publicPaths = [
        '/api/auth/login',
        '/api/public',
        '/api/afdian/webhook',
    ]
    if (event.path === '/') {
        return
    }
    if (publicPaths.some((path) => event.path.startsWith(path))) {
        return
    }

    const session = getSession(event)
    if (!session) {
        // 区分 API 请求和页面请求
        if (event.path.startsWith('/api/')) {
            throw createError({
                statusCode: 401,
                message: '请先登录',
            })
        } else {
            // 页面请求重定向到登录页
            return sendRedirect(event, '/login', 302)
        }
    }
    event.context.auth = session
    try {

        // 管理员路由权限验证
        if ((event.path.startsWith('/api/admin') || event.path.startsWith('/admin')) && session.role !== 'ADMIN') {
            throw createError({
                statusCode: 403,
                message: '需要管理员权限',
            })
        }
    } catch (error) {
        // 区分 API 请求和页面请求
        if (event.path.startsWith('/api/')) {
            throw createError({
                statusCode: 401,
                message: '登录已过期',
            })
        } else {
            // 页面请求重定向到登录页
            return sendRedirect(event, '/login', 302)
        }
    }
})
