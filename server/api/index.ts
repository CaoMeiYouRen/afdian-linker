import { checkDBHealth } from '@/server/utils/database'
import { ApiResponse, createApiResponse } from '@/server/types/api'

export default defineEventHandler(async () => {
    const dbStatus = await checkDBHealth()

    return createApiResponse({
        status: 200,
        message: 'API Service Running',
        checks: {
            database: dbStatus ? 'healthy' : 'unhealthy',
        },
        timestamp: new Date().toISOString(),
    })
})
