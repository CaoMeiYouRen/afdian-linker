import { createError, getQuery } from 'h3'
import { z } from 'zod'
import { getDataSource } from '@/server/utils/database'
import { VerificationCode } from '@/server/entities/verification-code'
import { requireAdmin } from '@/server/utils/auth'
import { createPaginatedResponse } from '@/server/types/pagination'

// 分页参数校验
const verificationCodeQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    perPage: z.coerce.number().min(1).max(100).default(20),
    sort: z.enum(['createdAt']).optional(),
    order: z.enum(['ASC', 'DESC']).default('DESC'),
})

export default defineEventHandler(async (event) => {
    try {
        const query = await verificationCodeQuerySchema.parseAsync(getQuery(event))
        const { page, perPage, sort, order } = query

        const dataSource = await getDataSource()
        const repo = dataSource.getRepository(VerificationCode)

        const [list, total] = await repo.findAndCount({
            relations: ['user'],
            order: { [sort || 'createdAt']: order },
            skip: (page - 1) * perPage,
            take: perPage,
        })

        // 统一分页响应结构
        return createPaginatedResponse(
            list,
            {
                currentPage: page,
                perPage,
                totalPages: Math.ceil(total / perPage),
                totalItems: total,
            },
        )
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
