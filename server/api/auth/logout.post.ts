import { SESSION_KEY } from '@/server/utils/session'
import { ApiResponse, createApiResponse } from '@/server/types/api'

export default defineEventHandler((event) => {
    deleteCookie(event, SESSION_KEY, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    })

    return createApiResponse({
        success: true,
    }, 200, '登出成功')
})
