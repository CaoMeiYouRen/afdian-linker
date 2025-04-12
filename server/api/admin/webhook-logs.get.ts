import { getDataSource } from '@/server/utils/database'
import { WebhookLog } from '@/entities/WebhookLog'
import { createApiResponse } from '@/server/types/api'

export default defineEventHandler(async (event) => {
    const dataSource = await getDataSource()
    const logRepo = dataSource.getRepository(WebhookLog)

    const logs = await logRepo.find({
        order: {
            createdAt: 'DESC',
        },
        take: 100, // 最多返回最近100条记录
    })

    return createApiResponse({
        logs,
    })
})
