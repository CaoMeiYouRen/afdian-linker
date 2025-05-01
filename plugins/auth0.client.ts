import { createAuth0 } from '@auth0/auth0-vue'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(
        createAuth0({
            domain: import.meta.env.VITE_AUTH0_DOMAIN,
            clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
            authorizationParams: {
                redirect_uri: `${window.location.origin}/auth0-callback`,
            },
        }),
    )
})

export const enableAuth0 = Boolean(import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID)
