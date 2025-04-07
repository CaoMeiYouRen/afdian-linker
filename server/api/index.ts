import { checkDBHealth } from '../utils/database'

export default defineEventHandler(async () => {
    const dbStatus = await checkDBHealth()

    return {
        status: 200,
        message: 'API Service Running',
        checks: {
            database: dbStatus ? 'healthy' : 'unhealthy',
        },
        timestamp: new Date().toISOString(),
    }
})
