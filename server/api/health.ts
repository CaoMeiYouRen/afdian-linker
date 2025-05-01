import { z } from 'zod'
import { checkDBHealth } from '@/server/utils/database'
import { ApiResponse, createApiResponse } from '@/server/types/api'

const schema = z.object({
    deep: z.enum(['true', 'false']).default('false').optional(),
}).strict()

export default defineEventHandler(async (event) => {
    try {
        const query = schema.parse(getQuery(event))
        const checks: Record<string, string> = {
            server: 'healthy',
        }

        // 仅在请求深度检查时验证数据库
        if (query.deep === 'true') {
            checks.database = await checkDBHealth() ? 'healthy' : 'unhealthy'
        }

        return createApiResponse({
            checks,
            timestamp: new Date().toISOString(),
        }, 200, '健康检查成功')
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
