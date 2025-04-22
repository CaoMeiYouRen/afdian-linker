import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
    vercel: {
        functions: {
            maxDuration: 60, // 60 秒
        },
    },
})
