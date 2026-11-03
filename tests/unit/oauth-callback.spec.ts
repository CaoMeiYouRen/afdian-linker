// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { callWithNuxt } from 'nuxt/app'

const mocks = vi.hoisted(() => {
    const users: any[] = []
    const runtimeConfig: { value: Record<string, unknown> } = { value: {} }
    return {
        users,
        runtimeConfig,
        stateCookie: { value: 'state' },
        fetchUserInfo: vi.fn(),
        exchangeCodeForToken: vi.fn(),
        setAuthSession: vi.fn(),
        repo: {
            findOneBy: vi.fn(async (where: Record<string, unknown>) => users.find((user) => Object.entries(where).every(([key, value]) => user[key] === value)) ?? null),
            create: vi.fn((data: any) => ({ ...data, id: `new-${users.length + 1}` })),
            save: vi.fn(async (user: any) => {
                if (!users.includes(user)) {
                    users.push(user)
                }
                return user
            }),
        },
    }
})

vi.mock('h3', () => ({
    defineEventHandler: <T>(handler: T) => handler,
    getQuery: (event: { query: unknown }) => event.query,
    getCookie: () => mocks.stateCookie.value,
    deleteCookie: vi.fn(),
    sendRedirect: (_event: unknown, location: string) => ({ location }),
    createError: (input: { statusCode?: number, message?: string }) => Object.assign(new Error(input.message), input),
}))

vi.mock('@/server/utils/database', () => ({
    getDataSource: async () => ({ getRepository: () => mocks.repo }),
}))

vi.mock('@/server/utils/session', () => ({
    setAuthSession: mocks.setAuthSession,
}))

vi.mock('@/server/utils/cache', () => ({
    getCacheStore: () => ({
        get: async () => ({ timestamp: Date.now(), redirect_uri: '' }),
        del: async () => undefined,
    }),
}))

vi.mock('@/server/entities/user', () => ({
    User: class {},
    UserRole: { USER: 'USER', ADMIN: 'ADMIN' },
}))

vi.mock('@/server/utils/oauth', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/server/utils/oauth')>()
    return {
        ...actual,
        fetchUserInfo: mocks.fetchUserInfo,
        exchangeCodeForToken: mocks.exchangeCodeForToken,
    }
})

const { default: handler } = await import('@/server/api/auth/oauth-callback.get')

function makeEvent() {
    return {
        query: { code: 'code', state: 'state' },
        node: { req: { url: '/' } },
    } as any
}

async function runWithUser(userInfo: Record<string, unknown>) {
    mocks.fetchUserInfo.mockResolvedValue(userInfo)
    // useRuntimeConfig 依赖 Nuxt 上下文，测试中提供最小可用的伪上下文
    const fakeNuxt = {
        _id: 'nuxt-app',
        $config: mocks.runtimeConfig.value,
        vueApp: { runWithContext: (fn: () => unknown) => fn() },
    } as any
    return callWithNuxt(fakeNuxt, () => handler(makeEvent()))
}

describe('OAuth callback account linking', () => {
    beforeEach(() => {
        mocks.users.length = 0
        mocks.stateCookie.value = 'state'
        vi.clearAllMocks()
        mocks.runtimeConfig.value = {
            oauthProviderId: 'oauth',
            oauthClientId: 'client',
            oauthClientSecret: 'secret',
            oauthTokenUrl: 'https://provider/token',
            oauthUserInfoUrl: 'https://provider/userinfo',
            baseUrl: 'http://localhost',
        }
        mocks.exchangeCodeForToken.mockResolvedValue({ access_token: 'access-token' })
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('does not log in or bind an existing account when the provider email is unverified', async () => {
        const victim: any = { id: 'victim', email: 'victim@example.com', emailVerified: true, role: 'USER' }
        mocks.users.push(victim)

        await runWithUser({
            id: 'attacker',
            email: 'victim@example.com',
            email_verified: false,
            username: 'attacker',
        })

        expect(victim.oauthId).toBeUndefined()
        expect(mocks.setAuthSession).toHaveBeenCalledTimes(1)
        const session = (mocks.setAuthSession.mock.calls[0] as any[])[1]
        expect(session.id).not.toBe('victim')

        const created = mocks.users.find((user) => user.id === session.id)
        expect(created.email).toMatch(/@oauth\.local$/)
        expect(created.email).not.toBe('victim@example.com')
        expect(created.emailVerified).toBe(false)
    })

    it('binds an existing unlinked account only when the provider verified the email', async () => {
        const existing: any = { id: 'existing', email: 'user@example.com', emailVerified: false, role: 'USER' }
        mocks.users.push(existing)

        await runWithUser({
            id: 'provider-user',
            email: 'user@example.com',
            email_verified: true,
        })

        expect(existing.oauthId).toBe('oauth_provider-user')
        expect(existing.emailVerified).toBe(true)
        expect((mocks.setAuthSession.mock.calls[0] as any[])[1].id).toBe('existing')
    })

    it('rejects a verified email that is already bound to another OAuth identity', async () => {
        mocks.users.push({
            id: 'other',
            email: 'user@example.com',
            oauthId: 'oauth_other',
            emailVerified: true,
            role: 'USER',
        })

        const result: any = await runWithUser({
            id: 'provider-user',
            email: 'user@example.com',
            email_verified: true,
        })

        expect(mocks.setAuthSession).not.toHaveBeenCalled()
        expect(result.location).toContain('status=fail')
    })

    it('creates a verified account with the real email', async () => {
        await runWithUser({
            id: 'new-user',
            email: 'new@example.com',
            email_verified: true,
            username: 'new-user',
        })

        const created = mocks.users[0]
        expect(created.email).toBe('new@example.com')
        expect(created.emailVerified).toBe(true)
        expect(created.initialEmail).toBe(false)
        expect(mocks.setAuthSession).toHaveBeenCalledTimes(1)
    })

    it('rejects provider responses without a unique id', async () => {
        const result: any = await runWithUser({
            email: 'new@example.com',
            email_verified: true,
        })

        expect(mocks.setAuthSession).not.toHaveBeenCalled()
        expect(result.location).toContain('status=fail')
    })

    it('rejects a state that is not bound to this browser', async () => {
        mocks.stateCookie.value = 'attacker-state'

        const result: any = await runWithUser({
            id: 'new-user',
            email: 'new@example.com',
            email_verified: true,
        })

        expect(mocks.fetchUserInfo).not.toHaveBeenCalled()
        expect(mocks.setAuthSession).not.toHaveBeenCalled()
        expect(result.location).toContain('status=fail')
    })
})
