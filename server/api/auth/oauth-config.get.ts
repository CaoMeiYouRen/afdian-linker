import { defineEventHandler } from 'h3'
import { createApiResponse } from '@/server/types/api'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    // 检查 OAuth 配置是否完整
    const isConfigured = !!(
        config.oauthClientId
        && config.oauthClientSecret
        && config.oauthAuthorizationUrl
        && config.oauthTokenUrl
        && config.oauthUserInfoUrl
    )

    return createApiResponse({
        enabled: isConfigured,
        providerName: config.oauthProviderName || 'OAuth',
    })
})
