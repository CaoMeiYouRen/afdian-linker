import { defineEventHandler, sendRedirect, setCookie } from 'h3'
import { generateOAuthUrl, generateState } from '@/server/utils/oauth'
import { getCacheStore } from '@/server/utils/cache'
import { OAUTH_STATE_COOKIE, OAUTH_STATE_TTL } from '@/server/types/oauth'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    // 检查 OAuth 配置是否完整
    if (!config.oauthClientId || !config.oauthClientSecret || !config.oauthAuthorizationUrl) {
        throw createError({
            statusCode: 400,
            message: 'OAuth 配置不完整，请检查环境变量',
        })
    }

    try {
        // 生成状态值防止 CSRF 攻击
        const state = generateState()
        const redirectUri = `${config.baseUrl}/api/auth/oauth-callback`

        // 将状态值存储到缓存中，设置 10 分钟过期
        const cache = getCacheStore()
        await cache.set(`oauth_state_${state}`, {
            timestamp: Date.now(),
            redirect_uri: redirectUri,
        }, OAUTH_STATE_TTL) // 10 分钟

        // 同时写入浏览器 Cookie，回调时校验 state 是否来自同一个浏览器
        // 防止攻击者把自己的授权回调链接发给受害者（登录 CSRF）
        setCookie(event, OAUTH_STATE_COOKIE, state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: Math.floor(OAUTH_STATE_TTL / 1000),
        })

        // 生成授权 URL
        const authUrl = generateOAuthUrl({
            authorizationUrl: config.oauthAuthorizationUrl,
            clientId: config.oauthClientId,
            redirectUri,
            scope: config.oauthScope,
            state,
        })
        // console.log(authUrl)
        // 重定向到 OAuth 提供商
        return sendRedirect(event, authUrl, 302)
    } catch (error: any) {
        console.error('OAuth 授权失败:', error)
        throw createError({
            statusCode: 500,
            message: error.message || 'OAuth 授权失败',
        })
    }
})
