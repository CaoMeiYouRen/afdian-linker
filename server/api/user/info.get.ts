import jwt from 'jsonwebtoken'
import { omit } from 'lodash-es'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/server/entities/user'
import { SESSION_KEY } from '@/server/utils/session'
import { ApiResponse, createApiResponse } from '@/server/types/api'

export default defineEventHandler(async (event) => {
    try {
        const auth = event.context.auth as Session
        if (!auth) {
            return { statusCode: 401, message: '未登录' }
        }
        const dataSource = await getDataSource()
        const userRepo = dataSource.getRepository(User)
        const user = await userRepo.findOneBy({ id: auth.id })

        if (!user) {
            throw createError({
                statusCode: 401,
                message: '用户不存在',
            })
        }

        return createApiResponse(omit(user, ['password']), 200, '登录成功')
    } catch (error) {
        console.error(error)
        throw createError({
            statusCode: 401,
            message: '登录已过期',
        })
    }
})
