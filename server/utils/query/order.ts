import { z } from 'zod'
import { Repository } from 'typeorm'
import { Order } from '@/server/entities/order'
import { PaginatedData } from '@/server/types/pagination'

export const orderQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    perPage: z.coerce.number().min(1).max(100).default(20),
    status: z.enum(['PENDING', 'PAID', 'FAILED', 'EXPIRED']).optional(),
    paymentChannel: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    sort: z.enum(['createdAt', 'updatedAt', 'amount']).optional(),
    order: z.enum(['ASC', 'DESC']).default('DESC'),
    userId: z.string().optional(),
})

export type OrderQueryParams = z.infer<typeof orderQuerySchema>

export async function queryOrders(repository: Repository<Order>, params: OrderQueryParams, withUser?: boolean): Promise<PaginatedData<Order>> {
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

    if (params.userId) {
        where.userId = params.userId
    }

    const [orders, total] = await repository.findAndCount({
        where,
        order: {
            [params.sort || 'createdAt']: params.order,
        },
        skip: (params.page - 1) * params.perPage,
        take: params.perPage,
        relations: withUser ? ['user'] : undefined, // 查询 user 关联
    })

    return {
        items: orders,
        pagination: {
            currentPage: params.page,
            perPage: params.perPage,
            totalPages: Math.ceil(total / params.perPage),
            totalItems: total,
        },
    }
}
