import { rateLimit } from '@/server/utils/rate-limit'

export default defineEventHandler(async (event) => {
    // 限制 API 请求频率
    if (event.path.startsWith('/api')) {
        if (event.path.startsWith('/api/auth')) {
            // auth 路由限制为 5 次/分钟
            await rateLimit(event, {
                window: 60_000,
                max: 10,
            })
            return
        }
        if (event.path.startsWith('/api/user/email')) {
            // email 路由限制为 5 次/分钟
            await rateLimit(event, {
                window: 60_000,
                max: 5,
            })
            return
        }
        if (event.path.startsWith('/api/afdian')) {
            // afidian 路由限制为 60 次/分钟
            await rateLimit(event, {
                window: 60_000,
                max: 60,
            })
            return
        }
        // 如果是 POST/PATCH/PUT/DELETE 请求，限制为 20 次/分钟
        if (event.method === 'POST' || event.method === 'PATCH' || event.method === 'PUT' || event.method === 'DELETE') {
            await rateLimit(event, {
                window: 60_000,
                max: 20,
            })
            return
        }
        // 否则限制为 60 次/分钟
        await rateLimit(event, {
            window: 60_000,
            max: 60,
        })

    }
})
