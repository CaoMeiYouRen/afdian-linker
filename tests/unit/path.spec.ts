// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { hasDotSegment, isAdminRequestPath, isPathWithin, normalizeRequestPath } from '@/server/utils/path'

describe('normalizeRequestPath', () => {
    it('resolves dot segments', () => {
        expect(normalizeRequestPath('/admin/./orders')).toBe('/admin/orders')
        expect(normalizeRequestPath('/admin/../api/admin/orders')).toBe('/api/admin/orders')
        expect(normalizeRequestPath('/x/../admin')).toBe('/admin')
    })

    it('resolves percent-encoded dot segments', () => {
        expect(normalizeRequestPath('/%2e/admin')).toBe('/admin')
        expect(normalizeRequestPath('/.%2e/admin')).toBe('/admin')
        expect(normalizeRequestPath('/x/%2e%2e/admin')).toBe('/admin')
        expect(normalizeRequestPath('/%252e/admin')).toBe('/admin')
    })

    it('decodes percent-encoded characters', () => {
        expect(normalizeRequestPath('/%61dmin')).toBe('/admin')
        expect(normalizeRequestPath('/api%2fadmin%2forders')).toBe('/api/admin/orders')
    })

    it('ignores query string and fragment', () => {
        expect(normalizeRequestPath('/admin?foo=bar')).toBe('/admin')
        expect(normalizeRequestPath('/admin#section')).toBe('/admin')
    })

    it('keeps path case and drops trailing slash', () => {
        expect(normalizeRequestPath('/Admin/')).toBe('/Admin')
    })

    it('normalizes empty and root paths', () => {
        expect(normalizeRequestPath('')).toBe('/')
        expect(normalizeRequestPath('/')).toBe('/')
    })
})

describe('hasDotSegment', () => {
    it('detects literal and encoded dot segments', () => {
        expect(hasDotSegment('/./admin')).toBe(true)
        expect(hasDotSegment('/../admin')).toBe(true)
        expect(hasDotSegment('/%2e/admin')).toBe(true)
        expect(hasDotSegment('/x/%2e%2e/admin')).toBe(true)
        expect(hasDotSegment('/%252e/admin')).toBe(true)
        expect(hasDotSegment('/a/../b')).toBe(true)
    })

    it('allows normal paths containing dots', () => {
        expect(hasDotSegment('/admin/orders')).toBe(false)
        expect(hasDotSegment('/api/v1.0/orders')).toBe(false)
        expect(hasDotSegment('/files/report.final.pdf')).toBe(false)
    })
})

describe('isPathWithin', () => {
    it('matches the prefix itself and its children only', () => {
        expect(isPathWithin('/admin', '/admin')).toBe(true)
        expect(isPathWithin('/admin/orders', '/admin')).toBe(true)
        expect(isPathWithin('/administrator', '/admin')).toBe(false)
        expect(isPathWithin('/api/admin', '/api/admin')).toBe(true)
        expect(isPathWithin('/api/admin/orders', '/api/admin')).toBe(true)
        expect(isPathWithin('/api/administrator', '/api/admin')).toBe(false)
    })
})

describe('isAdminRequestPath', () => {
    it('matches admin paths case-insensitively', () => {
        expect(isAdminRequestPath('/admin')).toBe(true)
        expect(isAdminRequestPath('/Admin/Orders')).toBe(true)
        expect(isAdminRequestPath('/api/admin/orders')).toBe(true)
        expect(isAdminRequestPath('/API/ADMIN/ORDERS')).toBe(true)
    })

    it('does not match lookalike paths', () => {
        expect(isAdminRequestPath('/administrator')).toBe(false)
        expect(isAdminRequestPath('/api/administrator')).toBe(false)
        expect(isAdminRequestPath('/orders')).toBe(false)
    })
})
