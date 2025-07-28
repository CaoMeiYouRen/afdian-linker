import crypto from 'crypto'
import type { OAuthTokenResponse, OAuthUserInfo, OAuthState } from '@/server/types/oauth'

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
