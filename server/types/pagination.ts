import { getStatusMessage } from './api'

export interface Pagination {
    currentPage: number
    perPage: number
    totalPages: number
    totalItems: number
}

export interface PaginatedData<T> {
    items: T[]
    pagination: Pagination
}

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
        data: {
            items,
            pagination,
        },
    }
}
