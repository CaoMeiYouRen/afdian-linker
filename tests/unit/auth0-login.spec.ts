// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
    const users: any[] = []
    return {
        users,
        payload: { value: {} as Record<string, unknown> },
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
    readBody: (event: { body: unknown }) => event.body,
    createError: (input: { statusCode?: number, message?: string }) => Object.assign(new Error(input.message), input),
}))

vi.mock('jsonwebtoken', () => ({
    default: {
        decode: () => ({ header: { kid: 'test-kid' }, payload: mocks.payload.value }),
        verify: (_token: string, _key: string, _options: unknown, callback: (error: Error | null, payload: unknown) => void) => callback(null, mocks.payload.value),
    },
}))

vi.mock('jwks-rsa', () => ({
    JwksClient: class {
        async getSigningKey() {
            return { getPublicKey: () => 'public-key' }
        }
    },
}))

vi.mock('@/server/utils/database', () => ({
    getDataSource: async () => ({ getRepository: () => mocks.repo }),
}))

vi.mock('@/server/utils/session', () => ({
    setAuthSession: mocks.setAuthSession,
}))

vi.mock('@/server/entities/user', () => ({
    User: class {},
    UserRole: { USER: 'USER', ADMIN: 'ADMIN' },
}))

vi.stubGlobal('defineEventHandler', <T>(handler: T) => handler)
vi.stubGlobal('createError', (input: { statusCode?: number, message?: string }) => Object.assign(new Error(input.message), input))

const { default: handler } = await import('@/server/api/auth/auth0-login.post')

function makeEvent() {
    return { body: { token: 'fake-token' } } as any
}

async function loginWith(payload: Record<string, unknown>) {
    mocks.payload.value = payload
    return handler(makeEvent())
}

describe('Auth0 login account linking', () => {
    beforeEach(() => {
        mocks.users.length = 0
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('does not log in or bind an existing account when the Auth0 email is unverified', async () => {
        const victim: any = { id: 'victim', email: 'victim@example.com', emailVerified: true, role: 'USER' }
        mocks.users.push(victim)

        await loginWith({
            sub: 'auth0|attacker',
            email: 'victim@example.com',
            email_verified: false,
            name: 'attacker',
        })

        expect(victim.auth0Id).toBeUndefined()
        expect(mocks.setAuthSession).toHaveBeenCalledTimes(1)
        const session = (mocks.setAuthSession.mock.calls[0] as any[])[1]
        expect(session.id).not.toBe('victim')

        const created = mocks.users.find((user) => user.id === session.id)
        expect(created.email).toMatch(/@auth0\.local$/)
        expect(created.email).not.toBe('victim@example.com')
        expect(created.emailVerified).toBe(false)
    })

    it('binds an existing unlinked account only when Auth0 verified the email', async () => {
        const existing: any = { id: 'existing', email: 'user@example.com', emailVerified: false, role: 'USER' }
        mocks.users.push(existing)

        await loginWith({
            sub: 'auth0|provider-user',
            email: 'user@example.com',
            email_verified: true,
            name: 'User',
        })

        expect(existing.auth0Id).toBe('auth0|provider-user')
        expect(existing.emailVerified).toBe(true)
        expect((mocks.setAuthSession.mock.calls[0] as any[])[1].id).toBe('existing')
    })

    it('rejects a verified email that is already bound to another Auth0 identity', async () => {
        mocks.users.push({
            id: 'other',
            email: 'user@example.com',
            auth0Id: 'auth0|other',
            emailVerified: true,
            role: 'USER',
        })

        await expect(loginWith({
            sub: 'auth0|provider-user',
            email: 'user@example.com',
            email_verified: true,
            name: 'User',
        })).rejects.toMatchObject({ statusCode: 409 })

        expect(mocks.setAuthSession).not.toHaveBeenCalled()
    })

    it('creates a verified account with the real email', async () => {
        await loginWith({
            sub: 'auth0|new-user',
            email: 'new@example.com',
            email_verified: true,
            name: 'New User',
        })

        const created = mocks.users[0]
        expect(created.email).toBe('new@example.com')
        expect(created.emailVerified).toBe(true)
        expect(created.initialEmail).toBe(false)
        expect(mocks.setAuthSession).toHaveBeenCalledTimes(1)
    })

    it('rejects a payload without sub', async () => {
        await expect(loginWith({
            email: 'new@example.com',
            email_verified: true,
            name: 'New User',
        })).rejects.toMatchObject({ statusCode: 401 })

        expect(mocks.setAuthSession).not.toHaveBeenCalled()
    })
})
