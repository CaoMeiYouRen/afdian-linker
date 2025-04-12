import { z } from 'zod'
import type { DataSource, Repository } from 'typeorm'
import { Order } from '@/entities/Order'

// 查询参数验证
export const orderQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    perPage: z.coerce.number().min(1).max(100).default(20),
    status: z.enum(['PENDING', 'PAID', 'FAILED', 'EXPIRED']).optional(),
    paymentChannel: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    sort: z.enum(['createdAt', 'amount']).optional(),
    order: z.enum(['ASC', 'DESC']).default('DESC'),
})

export type OrderQueryParams = z.infer<typeof orderQuerySchema>

export async function queryOrders(repository: Repository<Order>, params: OrderQueryParams) {
    const where: any = {}
    if (params.status) {
        where.status = params.status
    }
    if (params.paymentChannel) {
        where.paymentChannel = params.paymentChannel
    }
    if (params.startDate || params.endDate) {
        where.createdAt = {}
        if (params.startDate) {
            where.createdAt.gte = params.startDate
        }
        if (params.endDate) {
            where.createdAt.lte = params.endDate
        }
    }

    const [orders, total] = await repository.findAndCount({
        where,
        order: {
            [params.sort || 'createdAt']: params.order,
        },
        skip: (params.page - 1) * params.perPage,
        take: params.perPage,
    })

    return {
        orders: orders.map((order) => ({
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
            currentPage: params.page,
            perPage: params.perPage,
            totalPages: Math.ceil(total / params.perPage),
            totalItems: total,
        },
    }
}
