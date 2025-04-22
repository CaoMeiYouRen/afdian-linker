import { z } from 'zod'
import { Repository } from 'typeorm'
import { Plan } from '@/server/entities/plan'
import { PaginatedData } from '@/server/types/pagination'

export const planQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    perPage: z.coerce.number().min(1).max(100).default(20),
    enabled: z.boolean().optional(),
    productType: z.number().int().optional(),
    sort: z.enum(['createdAt', 'amount', 'showAmount']).optional(),
    order: z.enum(['ASC', 'DESC']).default('DESC'),
})

export type PlanQueryParams = z.infer<typeof planQuerySchema>

export async function queryPlans(
    repository: Repository<Plan>,
    params: PlanQueryParams,
): Promise<PaginatedData<Plan>> {
    const where: any = {}
    if (typeof params.enabled === 'boolean') {
        where.enabled = params.enabled
    }
    if (typeof params.productType === 'number') {
        where.productType = params.productType
    }

    const [items, total] = await repository.findAndCount({
        where,
        order: {
            [params.sort || 'createdAt']: params.order,
        },
        skip: (params.page - 1) * params.perPage,
        take: params.perPage,
    })

    return {
        items,
        pagination: {
            currentPage: params.page,
            perPage: params.perPage,
            totalPages: Math.ceil(total / params.perPage),
            totalItems: total,
        },
    }
}
