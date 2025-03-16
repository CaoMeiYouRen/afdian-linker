// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-03-15',
    devtools: { enabled: true },

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
