// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function assertResponseData<T>(response: { data?: T }): asserts response is { data: T } {
    if (response.data === undefined) {
        throw new Error('Expected API response data to be defined')
    }
}

describe('GET /api', () => {
    beforeEach(() => {
        vi.stubGlobal('defineEventHandler', <T>(handler: T) => handler)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.resetModules()
    })

    it('should return API service info', async () => {
        const { default: handler } = await import('@/server/api/index')
        const res = await handler(undefined as never)

        expect(res).toHaveProperty('statusCode', 200)
        assertResponseData(res)

        expect(res.data).toHaveProperty('version', '1.0.0')
        expect(res.data).toHaveProperty('environment')
        expect(res.data).toHaveProperty('timestamp')
        expect(res.message).toBe('API Service Running')
        expect(res.statusMessage).toBe('OK')
        expect(Number.isNaN(Date.parse(res.data.timestamp))).toBe(false)
    })
})
