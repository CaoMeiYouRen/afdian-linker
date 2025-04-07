import { z } from 'zod'
import { H3Event } from 'h3'
import { getDataSource } from '@/server/utils/database'
import { Order, OrderStatus } from '@/entities/Order'
import { useAfdian } from '@/composables/useAfdian'

// 添加参数验证工具函数
async function getValidatedQuery<T extends z.ZodType>(event: H3Event, schema: T): Promise<z.infer<T>> {
    const query = getQuery(event)
    return schema.parseAsync(query)
}

const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    per_page: z.coerce.number().min(1).max(1000).default(10),
})

export default defineEventHandler(async (event) => {
    try {
        const params = await getValidatedQuery(event, querySchema)
        const dataSource = getDataSource()

        return await dataSource.transaction(async (manager) => {
            const { client } = useAfdian()
            const orderRepository = manager.getRepository(Order)

            const result = await client.queryOrder(params)

            // 批量更新逻辑
            const transactions = result.data.list.map((orderData) => orderRepository.save({
                custom_order_id: orderData.custom_order_id,
                payment_channel: 'afdian',
                channel_order_id: orderData.out_trade_no,
                status: orderData.status === 2 ? OrderStatus.PAID : OrderStatus.FAILED,
                amount: orderData.total_amount ? parseFloat(orderData.total_amount) : 0,
                currency: 'CNY',
                raw_data: orderData,
            }),
            )

            const orders = await Promise.all(transactions)

            return {
                code: 200,
                data: {
                    orders: orders.map((o) => ({ id: o.id, status: o.status })),
                    count: orders.length,
                    success: true,
                },
            }
        })
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                message: '参数验证失败',
                data: error.issues,
            })
        }
        console.error('同步失败:', error)
        throw createError({
            statusCode: 500,
            message: error?.message || '订单同步失败',
        })
    }
})
