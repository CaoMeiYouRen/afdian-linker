import { getAuthSession } from '@/server/utils/session'
import { isAdminRequestPath, isPathWithin, normalizeRequestPath } from '@/server/utils/path'
import { UserRole } from '@/types/user'
import { publicPaths } from '@/utils/public-paths'

export default defineEventHandler(async (event) => {
    const url = new URL(`http://${process.env.NUXT_HOST || process.env.NITRO_HOST || process.env.HOST || 'localhost'}${event.node.req.url}`)
    event.context.url = url
    // 统一使用归一化路径做门禁，避免点段、编码与大小写绕过
    const path = normalizeRequestPath(event.path)
    event.context.path = path
    event.context.rawPath = event.path
    if (path === '/') { // 首页路由直接放通
        return
    }
    if (path.startsWith('/__nuxt')) { // nuxt 内部页面直接放通
        return
    }
    if (path.startsWith('/_nuxt')) { // 静态资源路由直接放通
        return
    }
    if (isPathWithin(path, '/api/public')) { // 公共 API 路由直接放通
        return
    }
    if (publicPaths.some((publicPath) => isPathWithin(path, publicPath))) { // 公共路由直接放通
        return
    }
    const session = getAuthSession(event)
    if (!session) {
        // 区分 API 请求和页面请求
        if (path.startsWith('/api')) {
            throw createError({
                statusCode: 401,
                message: '请先登录',
            })
        } else if (!isPathWithin(path.toLowerCase(), '/login')) { // 页面请求重定向到登录页
            return sendRedirect(event, '/login', 302)
        } else {
            // 如果是登录页，直接返回
            return
        }
    }
    event.context.auth = session
    // 管理员路由权限验证（大小写不敏感，避免页面路由大小写不敏感匹配导致绕过）
    if (isAdminRequestPath(path) && session?.role !== UserRole.ADMIN) {
        throw createError({
            statusCode: 403,
            message: '需要管理员权限',
        })
    }
    // 其他路由权限验证
})
