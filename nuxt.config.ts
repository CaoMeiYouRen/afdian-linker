// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

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
    },
    runtimeConfig: {
        afdianUserId: process.env.AFDIAN_USER_ID,
        afdianToken: process.env.AFDIAN_TOKEN,
        afdianPlanId: process.env.AFDIAN_PLAN_ID,
        afdianProductType: process.env.AFDIAN_PRODUCT_TYPE,
        jwtSecret: process.env.JWT_SECRET,
        apiKeys: process.env.AUTH_API_KEYS,
        webhookToken: process.env.WEBHOOK_TOKEN,
    },
    devServer: {
        port: 3000,
    },
    nitro: {
        preset: 'node',
        externals: {
            // inline: ['typeorm', 'reflect-metadata'],
            inline: [],
        },
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
    },
    primevue: {
        components: {
            include: ['Toast', 'Button', 'InputText', 'Password'],
        },
        directives: {
            include: ['ripple', 'tooltip'],
        },
        options: {
            ripple: true,
        },
    },
})
