import { defineEventHandler, readBody } from 'h3'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/server/entities/user'
import { createApiResponse } from '@/server/types/api'

export default defineEventHandler(async (event) => {
    const auth = event.context.auth as Session
    if (!auth) {
        return createApiResponse(null, 401, '未登录')
    }
    const body = await readBody(event)
    const nickname = body?.nickname?.trim()
    if (!nickname) {
        return createApiResponse(null, 400, '昵称不能为空')
    }
    const dataSource = await getDataSource()
    const repo = dataSource.getRepository(User)
    await repo.update({ id: auth.id }, { nickname })
    return createApiResponse(null, 200, 'ok')
})
