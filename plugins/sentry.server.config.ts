import * as Sentry from '@sentry/nuxt'

export default defineNuxtPlugin((app) => {
    if (import.meta.env.VITE_SENTRY_DSN) {
        Sentry.init({
            dsn: import.meta.env.VITE_SENTRY_DSN,
        })
    }
})
