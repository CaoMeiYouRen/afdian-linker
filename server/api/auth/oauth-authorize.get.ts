import { defineEventHandler, getQuery, sendRedirect } from 'h3'
import ms from 'ms'
import { generateOAuthUrl, generateState } from '@/server/utils/oauth'
import { createApiResponse } from '@/server/types/api'
import { getCacheStore } from '@/server/utils/cache'

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
        }, ms('10m')) // 10 分钟

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
