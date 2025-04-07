import { H3Event } from 'h3'
import { Redis } from 'ioredis'
import { LRUCache } from 'lru-cache'

interface RateLimitOptions {
    window: number
    max: number
}

interface RateLimitStore {
    increment(key: string, window: number): Promise<number>
    reset(key: string): Promise<void>
}

class RedisStore implements RateLimitStore {
    private redis: Redis

    constructor(url: string) {
        this.redis = new Redis(url)
    }

    async increment(key: string, window: number): Promise<number> {
        const multi = this.redis.multi()
        multi.incr(key)
        multi.pexpire(key, window)
        const results = await multi.exec()
        return results?.[0]?.[1] as number
    }

    async reset(key: string): Promise<void> {
        await this.redis.del(key)
    }
}

class LRUStore implements RateLimitStore {
    private cache: LRUCache<string, number>

    constructor() {
        this.cache = new LRUCache({
            max: 5000,
            ttl: 1000 * 60 * 60,
        })
    }

    async increment(key: string, window: number): Promise<number> {
        const count = (this.cache.get(key) || 0) + 1
        this.cache.set(key, count, { ttl: window })
        return count
    }

    async reset(key: string): Promise<void> {
        this.cache.delete(key)
    }
}

let store: RateLimitStore = null as any

export function getStore() {
    if (store) {
        return store
    }
    if (process.env.REDIS_URL) {
        store = new RedisStore(process.env.REDIS_URL)
        return store
    }
    store = new LRUStore()
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
