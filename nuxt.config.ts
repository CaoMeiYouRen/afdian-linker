// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import Aura from '@primevue/themes/aura'

export default defineNuxtConfig({
    compatibilityDate: '2025-03-15',
    devtools: { enabled: true },
    css: [
    ],
    build: {
        transpile: ['vuetify'],
    },
    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                config.plugins?.push(vuetify({ autoImport: true }))
            })
        },
        '@primevue/nuxt-module',
        '@pinia/nuxt',
        '@sentry/nuxt/module',
    ],
    experimental: {
        componentIslands: true,
    },
    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
        resolve: {
            alias: {
            },
        },
        optimizeDeps: {
            exclude: [],
        },
        css: {
            preprocessorOptions: {
                scss: {
                    silenceDeprecations: ['import', 'legacy-js-api'], // 忽略警告
                },
            },
        },
    },
    runtimeConfig: {
        afdianUserId: process.env.AFDIAN_USER_ID,
        afdianToken: process.env.AFDIAN_TOKEN,
        webhookToken: process.env.AFDIAN_WEBHOOK_TOKEN || process.env.WEBHOOK_TOKEN,
        jwtSecret: process.env.JWT_SECRET,
        apiKeys: process.env.AUTH_API_KEYS,
        smtpHost: process.env.SMTP_HOST,
        smtpPort: process.env.SMTP_PORT,
        smtpUser: process.env.SMTP_USER,
        smtpPass: process.env.SMTP_PASS,
        smtpFrom: process.env.SMTP_FROM,
        smtpSecure: process.env.SMTP_SECURE === 'true',
        baseUrl: process.env.BASE_URL || 'http://localhost:3000',
        // OAuth 2.0 配置
        oauthClientId: process.env.OAUTH_CLIENT_ID,
        oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
        oauthAuthorizationUrl: process.env.OAUTH_AUTHORIZATION_URL,
        oauthTokenUrl: process.env.OAUTH_TOKEN_URL,
        oauthUserInfoUrl: process.env.OAUTH_USER_INFO_URL,
        oauthProviderName: process.env.OAUTH_PROVIDER_NAME || 'OAuth',
        oauthProviderId: process.env.OAUTH_PROVIDER_ID || 'oauth',
        oauthScope: process.env.OAUTH_SCOPE,
    },
    devServer: {
        port: Number(process.env.PORT || 3000),
    },
    nitro: {
        // preset: process.env.NODE_ENV === 'production' ? 'vercel' : 'node-server',
        esbuild: {
            options: {
                target: 'esnext',
                tsconfigRaw: {
                    compilerOptions: {
                        experimentalDecorators: true,
                    },
                },
            },
        },
        typescript: {
            tsConfig: {
                compilerOptions: {
                    emitDecoratorMetadata: true,
                    experimentalDecorators: true,
                    strictPropertyInitialization: false,
                },
            },
        },
        vercel: {
            functions: {
                maxDuration: 60, // 最长持续 60 秒
                memory: 1024, // 最大 1 GB 内存
            },
        },
    },
    primevue: {
        components: {
            include: ['Toast'],
        },
        options: {
            theme: {
                preset: Aura,
            },
        },
    },
    sentry: {
        sourceMapsUploadOptions: {
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT || 'afdian-linker',
            authToken: process.env.SENTRY_AUTH_TOKEN,
        },
        autoInjectServerSentry: 'top-level-import',
    },
    sourcemap: { client: 'hidden' },
})
