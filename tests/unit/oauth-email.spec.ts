// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { createSyntheticEmail, getOAuthEmail, getVerifiedOAuthEmail, isOAuthEmailVerified } from '@/server/utils/oauth'

describe('isOAuthEmailVerified', () => {
    it('accepts explicit true values', () => {
        expect(isOAuthEmailVerified({ email_verified: true })).toBe(true)
        expect(isOAuthEmailVerified({ email_verified: 'true' })).toBe(true)
        expect(isOAuthEmailVerified({ emailVerified: true })).toBe(true)
        expect(isOAuthEmailVerified({ verified_email: true })).toBe(true)
        expect(isOAuthEmailVerified({ verified: true })).toBe(true)
    })

    it('rejects anything that is not an explicit true', () => {
        expect(isOAuthEmailVerified({ email_verified: false })).toBe(false)
        expect(isOAuthEmailVerified({ email_verified: 'false' })).toBe(false)
        expect(isOAuthEmailVerified({ email_verified: 1 })).toBe(false)
        expect(isOAuthEmailVerified({ email_verified: '1' })).toBe(false)
        expect(isOAuthEmailVerified({ email_verified: 'yes' })).toBe(false)
        expect(isOAuthEmailVerified({})).toBe(false)
        expect(isOAuthEmailVerified({ email_verified: null })).toBe(false)
    })
})

describe('getOAuthEmail', () => {
    it('returns trimmed emails', () => {
        expect(getOAuthEmail({ email: '  User@Example.com  ' })).toBe('User@Example.com')
    })

    it('rejects missing or non-string emails', () => {
        expect(getOAuthEmail({})).toBeUndefined()
        expect(getOAuthEmail({ email: '' })).toBeUndefined()
        expect(getOAuthEmail({ email: '   ' })).toBeUndefined()
        expect(getOAuthEmail({ email: 123 })).toBeUndefined()
    })
})

describe('getVerifiedOAuthEmail', () => {
    it('returns the email only when the provider verified it', () => {
        expect(getVerifiedOAuthEmail({ email: 'user@example.com', email_verified: true })).toBe('user@example.com')
        expect(getVerifiedOAuthEmail({ email: 'user@example.com', verified_email: true })).toBe('user@example.com')
    })

    it('never returns an email that is unverified or of unknown status', () => {
        expect(getVerifiedOAuthEmail({ email: 'victim@example.com', email_verified: false })).toBeUndefined()
        expect(getVerifiedOAuthEmail({ email: 'victim@example.com' })).toBeUndefined()
        expect(getVerifiedOAuthEmail({ email: 'victim@example.com', email_verified: 'yes' })).toBeUndefined()
    })

    it('requires both a verified status and an email', () => {
        expect(getVerifiedOAuthEmail({ email_verified: true })).toBeUndefined()
        expect(getVerifiedOAuthEmail({ email: '   ', email_verified: true })).toBeUndefined()
    })
})

describe('createSyntheticEmail', () => {
    it('creates a deterministic placeholder email', () => {
        const first = createSyntheticEmail('oauth', 'custom_12345')
        const second = createSyntheticEmail('oauth', 'custom_12345')
        expect(first).toBe(second)
        expect(first).toMatch(/^oauth_[a-f0-9]{16}@oauth\.local$/)
    })

    it('separates different subjects and providers', () => {
        expect(createSyntheticEmail('oauth', 'a')).not.toBe(createSyntheticEmail('oauth', 'b'))
        expect(createSyntheticEmail('oauth', 'a')).not.toBe(createSyntheticEmail('auth0', 'a'))
    })

    it('sanitizes the prefix and supports a custom domain', () => {
        const email = createSyntheticEmail('oauth|provider', 'subject with spaces', 'auth0.local')
        expect(email).toMatch(/^oauthprovider_[a-f0-9]{16}@auth0\.local$/)
    })
})
