// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-03-15',
    devtools: { enabled: true },

    // 新增Vuetify配置
    css: [
        'vuetify/lib/styles/main.sass',
        '@mdi/font/css/materialdesignicons.min.css',
    ],
    build: {
        transpile: ['vuetify'],
    },
    vite: {
        define: {
            // 'process.env.DEBUG': false,
        },
    },

    runtimeConfig: {
        afdianUserId: process.env.AFDIAN_USER_ID,
        afdianToken: process.env.AFDIAN_TOKEN,
        public: {
            afdianPlanId: process.env.AFDIAN_PLAN_ID,
        },
    },

    nitro: {
        preset: 'vercel',
        storage: {
            orders: { driver: 'fs' },
        },
    },
})
