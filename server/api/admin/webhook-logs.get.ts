import { createError } from 'h3'
import { z } from 'zod'
import { getDataSource } from '@/server/utils/database'
import { WebhookLog } from '@/server/entities/webhook-log'
import { createApiResponse } from '@/server/types/api'
import { webhookLogQuerySchema, queryWebhookLogs } from '@/server/utils/query/webhook-log'
import { createPaginatedResponse } from '@/server/types/pagination'

export default defineEventHandler(async (event) => {
    try {
        const query = await webhookLogQuerySchema.parseAsync(getQuery(event))
        const dataSource = await getDataSource()
        const logRepo = dataSource.getRepository(WebhookLog)

        const result = await queryWebhookLogs(logRepo, query)
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
