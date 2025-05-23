import { createError } from 'h3'
import { z } from 'zod'
import { getDataSource } from '@/server/utils/database'
import { Plan } from '@/server/entities/plan'
import { Session } from '@/server/utils/session'
import { createPaginatedResponse } from '@/server/types/pagination'
import { planQuerySchema, queryPlans } from '@/server/utils/query/plan'

export default defineEventHandler(async (event) => {
    try {
        const query = await planQuerySchema.parseAsync(getQuery(event))
        const dataSource = await getDataSource()
        const planRepository = dataSource.getRepository(Plan)

        const result = await queryPlans(planRepository, query)
        return createPaginatedResponse(result.items, result.pagination)
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
