import { z } from 'zod'
import { syncAfdianOrders } from '@/server/utils/sync-afdian-orders'

export default defineEventHandler(async (event) => {
    const authHeader = event.headers.get('authorization') || ''
    if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }
    // 调用同步函数
    try {
        const result = await syncAfdianOrders({ page: 1, per_page: 100 })
        return result
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                message: error.issues.map((e) => e.message).join(', '),
                data: error.issues,
            })
        }
        throw error
    }
})
