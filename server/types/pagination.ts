import { getStatusMessage } from './api'
import type { PaginatedData, Pagination } from '@/types/pagination'

export type { PaginatedData, Pagination }

export interface PaginatedResponse<T> {
    statusCode: number
    statusMessage: string
    message?: string
    data: PaginatedData<T>
}

export function createPaginatedResponse<T>(items: T[], pagination: Pagination, statusCode = 200, message = 'ok'): PaginatedResponse<T> {
    return {
        statusCode,
        statusMessage: getStatusMessage(statusCode),
        message,
        data: {
            items,
            pagination,
        },
    }
}
