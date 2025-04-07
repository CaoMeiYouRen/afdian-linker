import { SESSION_KEY } from '@/server/utils/session'

export default defineEventHandler((event) => {
    deleteCookie(event, SESSION_KEY, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    })

    return {
        success: true,
    }
})
