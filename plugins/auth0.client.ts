import { createAuth0 } from '@auth0/auth0-vue'

export default defineNuxtPlugin((nuxtApp) => {
    if (import.meta.client) {
        const domain = import.meta.env.VITE_AUTH0_DOMAIN
        const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID

        if (domain && clientId) {
            nuxtApp.vueApp.use(
                createAuth0({
                    domain,
                    clientId,
                    authorizationParams: {
                        redirect_uri: `${window.location.origin}/auth0-callback`,
                    },
                }),
            )
        }
    }
})

export const enableAuth0 = Boolean(import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID)
