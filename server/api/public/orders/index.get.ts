import { z } from 'zod'
import { createError } from 'h3'
import { getDataSource } from '@/server/utils/database'
import { Order } from '@/server/entities/order'
import { verifyApiKey } from '@/server/utils/auth'
import { ApiResponse, createApiResponse } from '@/server/types/api'
import { orderQuerySchema, queryOrders } from '@/server/utils/query/order'

export default defineEventHandler(async (event) => {
    const apiKey = getHeader(event, 'X-Api-Key') || ''
    if (!await verifyApiKey(apiKey)) {
        throw createError({
            statusCode: 401,
            message: '无效的API Key',
        })
    }

    try {
        const query = await orderQuerySchema.parseAsync(getQuery(event))
        const dataSource = await getDataSource()
        const orderRepository = dataSource.getRepository(Order)

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
        throw error
    }
})
