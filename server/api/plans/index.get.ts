import { z } from 'zod'
import { getDataSource } from '@/server/utils/database'
import { Plan } from '@/server/entities/plan'
import { createPaginatedResponse } from '@/server/types/pagination'
import { planQuerySchema, queryPlans } from '@/server/utils/query/plan'

export default defineEventHandler(async (event) => {
    try {
        // 只允许查 enabled 的
        const queryInput = { ...getQuery(event), enabled: true }
        const query = await planQuerySchema.parseAsync(queryInput)
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
