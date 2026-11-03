import crypto from 'crypto'
import type { OAuthTokenResponse, OAuthUserInfo } from '@/server/types/oauth'

/**
 * 生成 OAuth 授权 URL
 */
export function generateOAuthUrl(config: {
    authorizationUrl: string
    clientId: string
    redirectUri: string
    scope?: string
    state?: string
}): string {
    const { authorizationUrl, clientId, redirectUri, scope = 'read:user user:email', state } = config

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        scope,
        ...state && { state },
    })

    return `${authorizationUrl}?${params.toString()}`
}

/**
 * 交换授权码获取访问令牌
 */
export async function exchangeCodeForToken(config: {
    tokenUrl: string
    clientId: string
    clientSecret: string
    code: string
    redirectUri: string
}): Promise<OAuthTokenResponse> {
    const { tokenUrl, clientId, clientSecret, code, redirectUri } = config

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            code,
            redirect_uri: redirectUri,
        }),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`OAuth token exchange failed: ${response.status} ${error}`)
    }

    return response.json()
}

/**
 * 使用访问令牌获取用户信息
 */
export async function fetchUserInfo(config: {
    userInfoUrl: string
    accessToken: string
}): Promise<OAuthUserInfo> {
    const { userInfoUrl, accessToken } = config

    const response = await fetch(userInfoUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
        },
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`OAuth user info fetch failed: ${response.status} ${error}`)
    }

    const userInfo = await response.json()

    // 标准化用户信息字段
    return normalizeUserInfo(userInfo)
}

/**
 * 标准化不同 OAuth 提供商的用户信息字段
 */
function normalizeUserInfo(userInfo: any): OAuthUserInfo {
    // 保留原始数据
    const normalized = { ...userInfo }

    // 标准化 ID 字段
    if (!normalized.id) {
        normalized.id = userInfo.sub || userInfo.user_id || userInfo.login || userInfo.username
    }

    // 标准化邮箱字段
    if (!normalized.email) {
        normalized.email = userInfo.email || userInfo.mail
    }

    // 标准化邮箱验证状态字段
    if (normalized.email_verified === undefined) {
        normalized.email_verified = userInfo.email_verified ?? userInfo.emailVerified ?? userInfo.verified_email ?? userInfo.verified
    }

    // 标准化名称字段
    if (!normalized.name) {
        normalized.name = userInfo.name || userInfo.full_name || userInfo.display_name
    }

    // 标准化用户名字段
    if (!normalized.username) {
        normalized.username = userInfo.username || userInfo.login || userInfo.preferred_username || userInfo.name
    }

    // 标准化昵称字段
    if (!normalized.nickname) {
        normalized.nickname = userInfo.nickname || userInfo.name || userInfo.username
    }

    // 标准化头像字段
    if (!normalized.picture && !normalized.avatar_url) {
        normalized.picture = userInfo.picture || userInfo.avatar || userInfo.avatar_url
    }

    return normalized
}

export interface OAuthEmailClaims {
    email?: unknown
    email_verified?: unknown
    emailVerified?: unknown
    verified_email?: unknown
    verified?: unknown
}

/**
 * 判断 OAuth 提供商是否明确验证了邮箱
 * 只接受布尔 true 或字符串 "true"，其余一律视为未验证
 */
export function isOAuthEmailVerified(claims: OAuthEmailClaims): boolean {
    const value = claims.email_verified ?? claims.emailVerified ?? claims.verified_email ?? claims.verified
    return value === true || value === 'true'
}

/**
 * 获取规范化后的邮箱，缺失或非字符串时返回 undefined
 */
export function getOAuthEmail(claims: OAuthEmailClaims): string | undefined {
    if (typeof claims.email !== 'string') {
        return undefined
    }
    const email = claims.email.trim()
    return email || undefined
}

/**
 * 仅返回已验证邮箱；未验证邮箱不能用于匹配或绑定已有账号
 */
export function getVerifiedOAuthEmail(claims: OAuthEmailClaims): string | undefined {
    if (!isOAuthEmailVerified(claims)) {
        return undefined
    }
    return getOAuthEmail(claims)
}

/**
 * 生成不会与真实邮箱冲突的占位邮箱
 * 用于提供商未返回或未验证邮箱的场景，避免占用/冒用他人邮箱
 */
export function createSyntheticEmail(prefix: string, subject: string, domain = 'oauth.local'): string {
    const safePrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '') || 'oauth'
    const hash = crypto.createHash('sha256').update(subject).digest('hex').slice(0, 16)
    return `${safePrefix}_${hash}@${domain}`
}

/**
 * 生成随机状态值用于防止 CSRF 攻击
 */
export function generateState(): string {
    return crypto.randomBytes(32).toString('hex')
}

/**
 * 验证状态值
 */
export function validateState(receivedState: string, storedState: string): boolean {
    return receivedState === storedState
}
