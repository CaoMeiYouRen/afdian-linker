import { hasDotSegment } from '@/server/utils/path'

// 在其它中间件之前拒绝含点段的请求，避免 Nuxt 页面路由解析点段后绕过路径门禁
// 参考 GHSA-9v7c-q64q-vv33
export default defineEventHandler((event) => {
    if (hasDotSegment(event.path)) {
        throw createError({
            statusCode: 404,
            message: '页面不存在',
        })
    }
})
