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
