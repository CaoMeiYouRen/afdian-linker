import { ApiResponse, createApiResponse } from '@/server/types/api'

export default defineEventHandler(async () => createApiResponse({
        version: '1.0.0',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    }, 200, 'API Service Running'))
