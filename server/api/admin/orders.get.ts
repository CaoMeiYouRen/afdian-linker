import { createError } from 'h3'
import { z } from 'zod'
import { omit } from 'lodash-es'
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

        const result = await queryOrders(orderRepository, query, ['user', 'plan']) // 查询 user 关联

        // 优化：只返回用户部分字段
        const itemsWithUser = result.items.map((order) => {
            const { user, ...orderData } = order
            return {
                ...orderData,
                user: omit(user, ['password', 'initialPassword', 'initialEmail']),
            }
        })

        return createPaginatedResponse(itemsWithUser, result.pagination)
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
