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
        '@prisma/nuxt',
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
                '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
            },
        },
    },
    runtimeConfig: {
        afdianUserId: process.env.AFDIAN_USER_ID,
        afdianToken: process.env.AFDIAN_TOKEN,
        public: {
            afdianPlanId: process.env.AFDIAN_PLAN_ID,
        },
    },
    devServer: {
        port: 3000,
    },
    nitro: {
        preset: 'node',
        // storage: {
        //     orders: { driver: 'fs', base: './data' },
        // },
        externals: {
            inline: ['@prisma/client'],
        },
    },
})
