import type { H3Event } from 'h3'
import jwt from 'jsonwebtoken'

export async function requireAuth(event: H3Event) {
    const auth = event.context.auth
    if (!auth) {
        throw createError({
            statusCode: 401,
            message: '请先登录',
        })
    }
    return auth
}

export async function requireAdmin(event: H3Event) {
    const auth = await requireAuth(event)
    if (auth.role !== 'ADMIN') {
        throw createError({
            statusCode: 403,
            message: '需要管理员权限',
        })
    }
    return auth
}

export function generateToken(payload: any, expiresIn = '24h') {
    const config = useRuntimeConfig()
    return jwt.sign(payload, config.jwtSecret, { expiresIn: expiresIn as any })
}
