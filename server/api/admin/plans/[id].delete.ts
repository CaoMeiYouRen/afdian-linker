import { createError } from 'h3'
import { getDataSource } from '@/server/utils/database'
import { Plan } from '@/server/entities/plan'
import { Session } from '@/server/utils/session'
import { createApiResponse } from '@/server/types/api'

export default defineEventHandler(async (event) => {
    const auth = event.context.auth as Session
    if (!auth || auth.role !== 'ADMIN') {
        throw createError({ statusCode: 403, message: '无权限' })
    }
    const planId = getRouterParam(event, 'id')
    const dataSource = await getDataSource()
    const planRepository = dataSource.getRepository(Plan)
    const plan = await planRepository.findOneBy({ id: planId })
    if (!plan) {
        throw createError({ statusCode: 404, message: '方案不存在' })
    }
    await planRepository.remove(plan)
    return createApiResponse({ success: true }, 200, '方案删除成功')
})
