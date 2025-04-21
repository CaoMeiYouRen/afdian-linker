import { createError } from 'h3'
import { getDataSource } from '@/server/utils/database'
import { Plan } from '@/server/entities/plan'
import { Session } from '@/server/utils/session'
import { createPaginatedResponse } from '@/server/types/pagination'

export default defineEventHandler(async (event) => {
    const auth = event.context.auth as Session
    if (!auth || auth.role !== 'ADMIN') {
        throw createError({ statusCode: 403, message: '无权限' })
    }
    const dataSource = await getDataSource()
    const planRepository = dataSource.getRepository(Plan)
    const plans = await planRepository.find({ order: { createdAt: 'DESC' } })
    return { code: 200, data: plans }
})
