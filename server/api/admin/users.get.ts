import { createError } from 'h3'
import { z } from 'zod'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/entities/User'
import { createApiResponse } from '@/server/types/api'
import { userQuerySchema, queryUsers } from '@/server/utils/query/user'
import { createPaginatedResponse } from '@/server/types/pagination'

export default defineEventHandler(async (event) => {
    try {
        const query = await userQuerySchema.parseAsync(getQuery(event))
        const dataSource = await getDataSource()
        const userRepo = dataSource.getRepository(User)

        const result = await queryUsers(userRepo, query)
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
