import { getDataSource } from '@/server/utils/database'
import { User } from '@/entities/User'
import { createApiResponse } from '@/server/types/api'

export default defineEventHandler(async (event) => {
    const dataSource = await getDataSource()
    const userRepo = dataSource.getRepository(User)

    const users = await userRepo.find({
        select: [
            'id',
            'username',
            'nickname',
            'email',
            'role',
            'createdAt',
            'updatedAt',
            'initialPassword',
            'initialEmail',
        ],
        order: {
            createdAt: 'DESC',
        },
    })

    return createApiResponse({
        users,
    })
})
