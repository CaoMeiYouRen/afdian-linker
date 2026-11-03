import type { H3Event } from 'h3'
import jwt from 'jsonwebtoken'
import { getAuthSession } from '@/server/utils/session'
import { UserRole } from '@/types/user'

export async function requireAuth(event: H3Event) {
    // 优先使用全局中间件写入的会话；缺失时兜底自行校验，
    // 保证 handler 级鉴权不依赖中间件是否被执行
    const auth = event.context.auth || getAuthSession(event)
    if (!auth) {
        throw createError({
            statusCode: 401,
            message: '请先登录',
        })
    }
    event.context.auth = auth
    return auth
}

export async function requireAdmin(event: H3Event) {
    const auth = await requireAuth(event)
    if (auth?.role !== UserRole.ADMIN) {
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

/**
 * 验证 API Key 是否有效
 * @param apiKey 待验证的API Key
 * @returns 验证结果
 */
export async function verifyApiKey(apiKey: string | null): Promise<boolean> {
    if (!apiKey) {
        return false
    }

    const config = useRuntimeConfig()
    const validKeys = (config.apiKeys || '').split(',')

    return validKeys.some((key) => key.trim() === apiKey)
}
