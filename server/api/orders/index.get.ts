import { createError } from 'h3'
import { z } from 'zod'
import { omit } from 'lodash-es'
import { getDataSource } from '@/server/utils/database'
import { Order } from '@/server/entities/order'
import { ApiResponse, createApiResponse } from '@/server/types/api'
import { orderQuerySchema, queryOrders } from '@/server/utils/query/order'
import { Session } from '@/server/utils/session'
import { createPaginatedResponse } from '@/server/types/pagination'

export default defineEventHandler(async (event) => {
    try {
        const auth = event.context.auth as Session
        const query = await orderQuerySchema.parseAsync(getQuery(event))
        const dataSource = await getDataSource()
        const orderRepository = dataSource.getRepository(Order)

        // 确保只能查询自己的订单
        query.userId = auth.id

        const result = await queryOrders(orderRepository, query, ['plan'])
        const itemsWithUser = result.items.map((order) => {
            const { user, ...orderData } = order
            return {
                ...orderData,
                user: omit(user, ['password', 'initialPassword', 'initialEmail', 'rawData']),
            }
        })

        return createPaginatedResponse(itemsWithUser, result.pagination)
    } catch (error) {
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
