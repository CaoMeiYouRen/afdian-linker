import { z } from 'zod'
import { Repository } from 'typeorm'
import { User } from '@/server/entities/user'
import { UserRole } from '@/types/user'
import { PaginatedData } from '@/server/types/pagination'

export const userQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    perPage: z.coerce.number().min(1).max(100).default(20),
    role: z.nativeEnum(UserRole).optional(),
    email: z.string().email().optional(),
    username: z.string().optional(),
    sort: z.enum(['createdAt', 'updatedAt', 'username']).optional(),
    order: z.enum(['ASC', 'DESC']).default('DESC'),
})

export type UserQueryParams = z.infer<typeof userQuerySchema>

export async function queryUsers(repository: Repository<User>, params: UserQueryParams): Promise<PaginatedData<User>> {
    const where: any = {}

    if (params.role) {
        where.role = params.role
    }
    if (params.email) {
        where.email = params.email
    }
    if (params.username) {
        where.username = params.username
    }

    const [users, total] = await repository.findAndCount({
        where,
        order: {
            [params.sort || 'createdAt']: params.order,
        },
        skip: (params.page - 1) * params.perPage,
        take: params.perPage,
    })

    return {
        items: users,
        pagination: {
            currentPage: params.page,
            perPage: params.perPage,
            totalPages: Math.ceil(total / params.perPage),
            totalItems: total,
        },
    }
}
