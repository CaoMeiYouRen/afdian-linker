import { z } from 'zod'
import { syncAfdianOrders } from '@/server/utils/orders/sync-afdian'

const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    per_page: z.coerce.number().min(1).max(100).default(50),
})

export default defineEventHandler(async (event) => {
    try {
        const body = querySchema.parse(await readBody(event))
        // 传递分页参数
        const result = await syncAfdianOrders(body)
        return result
    } catch (error: any) {
        console.error('同步失败:', error)
        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                message: error.issues.map((e) => e.message).join(', '),
                data: error.issues,
            })
        }

        throw createError({
            statusCode: 500,
            message: error?.message || '订单同步失败',
        })
    }
})
