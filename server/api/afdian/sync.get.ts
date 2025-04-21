import type { EventHandler, H3Event } from 'h3'
import { z } from 'zod'
import { In } from 'typeorm'
import { getDataSource } from '@/server/utils/database'
import { Order, OrderStatus } from '@/server/entities/order'
import { useAfdian } from '@/server/utils/afdian'
import { ApiResponse, createApiResponse } from '@/server/types/api'

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
        const dataSource = await getDataSource()

        return await dataSource.transaction(async (manager) => {
            const { client } = useAfdian()
            const orderRepository = manager.getRepository(Order)

            const result = await client.queryOrder(params)
            if (result.ec !== 200) {
                throw createError({
                    statusCode: 500,
                    message: result.em || '订单同步失败',
                })
            }
            // 处理返回的订单数据
            // 获取现有订单
            const existingOrders = await orderRepository.find({
                where: [{
                    channelOrderId: In(result.data.list.map((order) => order.out_trade_no)),
                }, {
                    customOrderId: In(result.data.list.map((order) => order.custom_order_id)),
                }],
            })

            const existingOrdersMap = new Map(
                existingOrders.map((order) => [order.channelOrderId, order]),
            )

            // 批量更新逻辑
            const transactions = result.data.list.map(async (orderData) => {
                const existingOrder = existingOrdersMap.get(orderData.out_trade_no)
                const orderToUpdate = {
                    ...existingOrder || {},
                    customOrderId: orderData.custom_order_id,
                    paymentChannel: 'afdian',
                    channelOrderId: orderData.out_trade_no,
                    status: orderData.status === 2 ? OrderStatus.PAID : OrderStatus.FAILED,
                    amount: orderData.total_amount,
                    currency: 'CNY',
                    rawData: orderData,
                }

                if (existingOrder) {
                    // 如果订单存在且状态没变，跳过更新
                    if (existingOrder.status === orderToUpdate.status) {
                        console.log(`订单 ${orderData.out_trade_no} 状态未变化，跳过更新`)
                        return existingOrder
                    }
                    // 更新现有订单
                    return orderRepository.save(orderToUpdate)
                }

                // 创建新订单
                return orderRepository.save(orderToUpdate)
            })

            const orders = await Promise.all(transactions)

            return createApiResponse({
                orders: orders.map((o) => ({ id: o.id, status: o.status })),
                count: orders.length,
            })
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
