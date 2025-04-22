import { defineNitroConfig } from 'nitropack'

export default defineNitroConfig({
  vercel: {
    functions: {
      maxDuration: 60, // 60 seconds
    },
  },
})
