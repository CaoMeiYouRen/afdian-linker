import path from 'path'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
    test: {
        globals: true,
        environment: 'nuxt',
    },
    root: path.resolve('./'),
    // coverage: {
    //     clean: true,
    //     reportsDirectory: path.resolve('./coverage'),
    // },
})
