import { createError } from 'h3'
import { z } from 'zod'
import { getDataSource } from '@/server/utils/database'
import { Order } from '@/server/entities/order'
import { ApiResponse, createApiResponse } from '@/server/types/api'
import { orderQuerySchema, queryOrders } from '@/server/utils/query/order'
import { createPaginatedResponse } from '@/server/types/pagination'

export default defineEventHandler(async (event) => {
    try {
        const query = await orderQuerySchema.parseAsync(getQuery(event))
        const dataSource = await getDataSource()
        const orderRepository = dataSource.getRepository(Order)

        const result = await queryOrders(orderRepository, query)
        return createPaginatedResponse(result.items, result.pagination)
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
