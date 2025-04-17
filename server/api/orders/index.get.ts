import { createError } from 'h3'
import { z } from 'zod'
import { getDataSource } from '@/server/utils/database'
import { Order } from '@/server/entities/order'
import { ApiResponse, createApiResponse } from '@/server/types/api'
import { orderQuerySchema, queryOrders } from '@/server/utils/query/order'
import { Session } from '@/server/utils/session'

export default defineEventHandler(async (event) => {
    try {
        const auth = event.context.auth as Session
        const query = await orderQuerySchema.parseAsync(getQuery(event))
        const dataSource = await getDataSource()
        const orderRepository = dataSource.getRepository(Order)

        // 确保只能查询自己的订单
        query.userId = auth.id

        const result = await queryOrders(orderRepository, query)
        return createApiResponse(result)
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                message: '参数验证失败',
                data: error.issues,
            })
        }
        // 统一处理其他类型错误
        throw createError({
            statusCode: 500,
            message: error instanceof Error ? error.message : '服务器内部错误',
        })
    }
})
