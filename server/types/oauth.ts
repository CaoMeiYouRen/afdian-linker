export interface OAuthTokenResponse {
    access_token: string
    token_type: string
    expires_in?: number
    refresh_token?: string
    scope?: string
}

export interface OAuthUserInfo {
    // 通用字段
    id: string
    email: string
    name?: string
    username?: string
    nickname?: string
    avatar_url?: string
    picture?: string
    // 邮箱是否由 OAuth 提供商验证
    email_verified?: boolean

    // 扩展字段，不同的 OAuth 提供商可能有不同的字段
    [key: string]: any
}

export interface OAuthState {
    redirect_uri: string
    timestamp: number
    nonce: string
}

// OAuth state 的 Cookie 名与有效期，用于把 state 绑定到发起授权的浏览器
export const OAUTH_STATE_COOKIE = 'oauth_state'
export const OAUTH_STATE_TTL = 10 * 60 * 1000
