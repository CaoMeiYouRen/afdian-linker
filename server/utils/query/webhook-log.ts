import { z } from 'zod'
import { Repository } from 'typeorm'
import { WebhookLog } from '@/entities/webhook-log'
import { PaginatedData } from '@/server/types/pagination'

export const webhookLogQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    perPage: z.coerce.number().min(1).max(100).default(20),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    sort: z.enum(['createdAt']).optional(),
    order: z.enum(['ASC', 'DESC']).default('DESC'),
})

export type WebhookLogQueryParams = z.infer<typeof webhookLogQuerySchema>

export async function queryWebhookLogs(repository: Repository<WebhookLog>, params: WebhookLogQueryParams): Promise<PaginatedData<WebhookLog>> {
    const where: any = {}

    if (params.startDate || params.endDate) {
        where.createdAt = {}
        if (params.startDate) {
            where.createdAt.gte = params.startDate
        }
        if (params.endDate) {
            where.createdAt.lte = params.endDate
        }
    }

    const [logs, total] = await repository.findAndCount({
        where,
        order: {
            [params.sort || 'createdAt']: params.order,
        },
        skip: (params.page - 1) * params.perPage,
        take: params.perPage,
    })

    return {
        items: logs,
        pagination: {
            currentPage: params.page,
            perPage: params.perPage,
            totalPages: Math.ceil(total / params.perPage),
            totalItems: total,
        },
    }
}
