import { createError } from 'h3'
import { z } from 'zod'
import { getDataSource } from '@/server/utils/database'
import { WebhookLog } from '@/entities/WebhookLog'
import { createApiResponse } from '@/server/types/api'
import { webhookLogQuerySchema, queryWebhookLogs } from '@/server/utils/query/webhook-log'

export default defineEventHandler(async (event) => {
    try {
        const query = await webhookLogQuerySchema.parseAsync(getQuery(event))
        const dataSource = await getDataSource()
        const logRepo = dataSource.getRepository(WebhookLog)

        const result = await queryWebhookLogs(logRepo, query)
        return createApiResponse(result)
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
