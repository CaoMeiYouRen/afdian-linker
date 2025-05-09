import jwt from 'jsonwebtoken'
import { getSession, SESSION_KEY } from '@/server/utils/session'
import { UserRole } from '@/types/user'
import { publicPaths } from '@/utils/public-paths'

export default defineEventHandler(async (event) => {
    const url = new URL(`http://${process.env.NUXT_PORT || process.env.HOST || 'localhost'}${event.node.req.url}`)
    event.context.url = url
    event.context.path = url.pathname
    if (event.context.path === '/') { // 首页路由直接放通
        return
    }
    if (event.context.path.startsWith('/api/public')) { // 公共 API 路由直接放通
        return
    }
    if (publicPaths.some((path) => event.context.path === path)) { // 公共路由直接放通
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
        } else if (!event.path.startsWith('/login')) { // 页面请求重定向到登录页
            return sendRedirect(event, '/login', 302)
        } else {
            // 如果是登录页，直接返回
            return
        }
    }
    event.context.auth = session
    // 管理员路由权限验证
    if ((event.path.startsWith('/api/admin') || event.path.startsWith('/admin')) && session?.role !== UserRole.ADMIN) {
        throw createError({
            statusCode: 403,
            message: '需要管理员权限',
        })
    }
    // 其他路由权限验证
})
