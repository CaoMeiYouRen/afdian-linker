import { ToastServiceMethods } from 'primevue/toastservice'

declare module '#app' {
    interface NuxtApp {
        $toast: ToastServiceMethods
    }
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $toast: ToastServiceMethods
    }
}

export { }
