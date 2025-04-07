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
    },
    runtimeConfig: {
        afdianUserId: process.env.AFDIAN_USER_ID,
        afdianToken: process.env.AFDIAN_TOKEN,
        public: {
            afdianPlanId: process.env.AFDIAN_PLAN_ID,
        },
        jwtSecret: process.env.JWT_SECRET,
    },
    devServer: {
        port: 3000,
    },
    nitro: {
        preset: 'node',
        externals: {
            // inline: ['typeorm', 'reflect-metadata'],
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
})
