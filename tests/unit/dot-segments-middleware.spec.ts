// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type Middleware = (event: { path: string }) => unknown

describe('dot segment middleware', () => {
    beforeEach(() => {
        vi.stubGlobal('defineEventHandler', <T>(handler: T) => handler)
        vi.stubGlobal('createError', (input: { statusCode?: number, message?: string }) => Object.assign(new Error(input.message), input))
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.resetModules()
    })

    async function loadMiddleware(): Promise<Middleware> {
        const mod = await import('@/server/middleware/0-dot-segments')
        return mod.default as Middleware
    }

    it('rejects literal dot segments', async () => {
        const middleware = await loadMiddleware()
        expect(() => middleware({ path: '/./admin' })).toThrow()
        expect(() => middleware({ path: '/../admin' })).toThrow()
        expect(() => middleware({ path: '/x/../admin' })).toThrow()
    })

    it('rejects percent-encoded dot segments', async () => {
        const middleware = await loadMiddleware()
        expect(() => middleware({ path: '/%2e/admin' })).toThrow()
        expect(() => middleware({ path: '/.%2e/admin' })).toThrow()
        expect(() => middleware({ path: '/x/%2e%2e/admin' })).toThrow()
        expect(() => middleware({ path: '/%252e/admin' })).toThrow()
    })

    it('lets normal paths through', async () => {
        const middleware = await loadMiddleware()
        expect(() => middleware({ path: '/admin/orders' })).not.toThrow()
        expect(() => middleware({ path: '/api/admin/orders?page=1' })).not.toThrow()
        expect(() => middleware({ path: '/files/report.final.pdf' })).not.toThrow()
    })
})
