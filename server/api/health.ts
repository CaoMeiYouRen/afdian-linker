import { checkDBHealth } from '@/server/utils/database'
import { ApiResponse, createApiResponse } from '@/server/types/api'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
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
})
