export interface Pagination {
    currentPage: number
    perPage: number
    totalPages: number
    totalItems: number
}

export interface PaginatedResponse<T> {
    statusCode: number
    message?: string
    data: {
        items: T[]
        pagination: Pagination
    }
}
