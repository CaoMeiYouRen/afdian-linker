import { Redis } from 'ioredis'
import { LRUCache } from 'lru-cache'

export interface CacheStore {
    get<T = any>(key: string): Promise<T | undefined>
    set<T = any>(key: string, value: T, ttl?: number): Promise<void>
    del(key: string): Promise<void>
}

class RedisCache implements CacheStore {
    private redis: Redis

    constructor(url: string) {
        this.redis = new Redis(url)
    }

    async get<T = any>(key: string): Promise<T | undefined> {
        const val = await this.redis.get(key)
        return val ? JSON.parse(val) : undefined
    }

    async set<T = any>(key: string, value: T, ttl?: number): Promise<void> {
        const str = JSON.stringify(value)
        if (ttl) {
            await this.redis.set(key, str, 'PX', ttl)
        } else {
            await this.redis.set(key, str)
        }
    }

    async del(key: string): Promise<void> {
        await this.redis.del(key)
    }
}

class LRUCacheStore implements CacheStore {
    private cache: LRUCache<string, any>

    constructor() {
        this.cache = new LRUCache({
            max: 5000,
            ttl: 1000 * 60 * 60,
        })
    }

    async get<T = any>(key: string): Promise<T | undefined> {
        return this.cache.get(key)
    }

    async set<T = any>(key: string, value: T, ttl?: number): Promise<void> {
        this.cache.set(key, value, { ttl })
    }

    async del(key: string): Promise<void> {
        this.cache.delete(key)
    }
}

let store: CacheStore = null as any

export function getCacheStore() {
    if (store) {
        return store
    }
    if (process.env.REDIS_URL) {
        store = new RedisCache(process.env.REDIS_URL)
        return store
    }
    store = new LRUCacheStore()
    return store
}
