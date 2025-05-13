import { describe, it, expect, beforeAll } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('GET /api', async () => {

    beforeAll(async () => {
        await setup({
        })
    })

    it('should return API service info', async () => {
        const res = await $fetch<any>('/api')
        expect(res).toHaveProperty('statusCode', 200)
        expect(res).toHaveProperty('data')
        expect(res.data).toHaveProperty('version')
        expect(res.data).toHaveProperty('environment')
        expect(res.data).toHaveProperty('timestamp')
        expect(res).toHaveProperty('message', 'API Service Running')
    })
})
