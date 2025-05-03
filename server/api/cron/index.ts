import { z } from 'zod'
import { syncAfdianOrders } from '@/server/utils/orders/sync-afdian'
import { expirePendingOrders } from '@/server/utils/orders/expire'
import { cleanupVerificationCodes } from '@/server/utils/verification-codes/cleanup'

export default defineEventHandler(async (event) => {
    const authHeader = event.headers.get('authorization') || ''
    if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }
    try {
        const promises = await Promise.allSettled([
            cleanupVerificationCodes(),
            expirePendingOrders(),
            syncAfdianOrders({ page: 1, per_page: 100 }),
        ])
        const [cleanupResult, expireResult, syncResult] = promises
        const result = {
            cleanup: cleanupResult,
            expire: expireResult,
            sync: syncResult,
        }
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
