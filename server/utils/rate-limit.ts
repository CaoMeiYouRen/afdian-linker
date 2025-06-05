import { H3Event } from 'h3'
import { BaseRedisStore, BaseLRUStore } from './cache'

interface RateLimitOptions {
    // 窗口时间，毫秒
    window: number
    // 最大请求次数
    max: number
}

interface RateLimitStore {
    increment(key: string, window: number): Promise<number>
    reset(key: string): Promise<void>
}

// 复用 Redis Store
class RedisRateLimitStore extends BaseRedisStore implements RateLimitStore {
    async increment(key: string, window: number): Promise<number> {
        const multi = this.redis.multi()
        multi.incr(key)
        multi.pexpire(key, window)
        const results = await multi.exec()
        return results?.[0]?.[1] as number
    }
    async reset(key: string): Promise<void> {
        await this.del(key)
    }
}

// 复用 LRU Store
class LRURateLimitStore extends BaseLRUStore implements RateLimitStore {
    async increment(key: string, window: number): Promise<number> {
        const count = await this.get<number>(key) || 0
        await this.set(key, count + 1, window)
        return count + 1
    }
    async reset(key: string): Promise<void> {
        await this.del(key)
    }
}

let store: RateLimitStore = null as any

export function getStore() {
    if (store) {
        return store
    }
    if (process.env.REDIS_URL) {
        store = new RedisRateLimitStore(process.env.REDIS_URL)
        return store
    }
    store = new LRURateLimitStore()
    return store
}

export async function rateLimit(event: H3Event, options: RateLimitOptions) {
    const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
    const key = `ratelimit:${ip}:${event.path}`
    const $store = getStore()
    const count = await $store.increment(key, options.window)

    if (count > options.max) {
        throw createError({
            statusCode: 429,
            message: '请求过于频繁，请稍后再试',
        })
    }
}
