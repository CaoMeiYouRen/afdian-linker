import { z } from 'zod'
import { createError } from 'h3'
import { getDataSource } from '@/server/utils/database'
import { Order } from '@/entities/Order'
import { verifyApiKey } from '~/server/utils/auth'
import { ApiResponse, createApiResponse } from '@/server/types/api'

// 查询参数验证
const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    perPage: z.coerce.number().min(1).max(100).default(20),
    status: z.enum(['PENDING', 'PAID', 'FAILED', 'EXPIRED']).optional(),
    paymentChannel: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    sort: z.enum(['createdAt', 'amount']).optional(),
    order: z.enum(['ASC', 'DESC']).default('DESC'),
})

export default defineEventHandler(async (event): Promise<ApiResponse> => {
    const apiKey = getHeader(event, 'X-Api-Key') || ''
    if (!await verifyApiKey(apiKey)) {
        throw createError({
            statusCode: 401,
            message: '无效的API Key',
        })
    }

    try {
        const query = await querySchema.parseAsync(getQuery(event))
        const dataSource = await getDataSource()
        const orderRepository = dataSource.getRepository(Order)

        // 构建查询条件
        const where: any = {}
        if (query.status) {
            where.status = query.status
        }
        if (query.paymentChannel) {
            where.paymentChannel = query.paymentChannel
        }
        if (query.startDate || query.endDate) {
            where.createdAt = {}
            if (query.startDate) {
                where.createdAt.gte = query.startDate
            }
            if (query.endDate) {
                where.createdAt.lte = query.endDate
            }
        }

        // 查询订单列表
        const [orders, total] = await orderRepository.findAndCount({
            where,
            order: {
                [query.sort || 'createdAt']: query.order,
            },
            skip: (query.page - 1) * query.perPage,
            take: query.perPage,
        })

        return createApiResponse({
            orders: orders.map(order => ({
                id: order.id,
                customOrderId: order.customOrderId,
                status: order.status,
                amount: Number(order.amount),
                currency: order.currency,
                paymentChannel: order.paymentChannel,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            })),
            pagination: {
                currentPage: query.page,
                perPage: query.perPage,
                totalPages: Math.ceil(total / query.perPage),
                totalItems: total,
            },
        })

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
