import { H3Event } from 'h3'

interface RateLimitOptions {
    window: number // 时间窗口(ms)
    max: number // 最大请求次数
}

const rateLimitStore = new Map<string, { count: number, timestamp: number }>()

export async function rateLimit(event: H3Event, options: RateLimitOptions) {
    const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
    const key = `${ip}:${event.path}`
    const now = Date.now()

    const record = rateLimitStore.get(key)
    if (record) {
        if (now - record.timestamp < options.window) {
            if (record.count >= options.max) {
                throw createError({
                    statusCode: 429,
                    message: '请求过于频繁，请稍后再试',
                })
            }
            record.count++
        } else {
            record.count = 1
            record.timestamp = now
        }
    } else {
        rateLimitStore.set(key, {
            count: 1,
            timestamp: now,
        })
    }
}
