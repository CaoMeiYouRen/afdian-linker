import { defineEventHandler, readBody } from 'h3'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/server/entities/user'

export default defineEventHandler(async (event) => {
    const auth = event.context.auth as Session
    if (!auth) {
        return { statusCode: 401, message: '未登录' }
    }
    const body = await readBody(event)
    const nickname = body?.nickname?.trim()
    if (!nickname) {
        return { statusCode: 400, message: '昵称不能为空' }
    }
    const dataSource = await getDataSource()
    const repo = dataSource.getRepository(User)
    await repo.update({ id: auth.id }, { nickname })
    return { statusCode: 200, message: 'ok' }
})
