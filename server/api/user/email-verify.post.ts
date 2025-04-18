import { defineEventHandler } from 'h3'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/server/entities/user'
import { sendVerifyEmail } from '@/server/utils/email'
import { createApiResponse } from '@/server/types/api'

export default defineEventHandler(async (event) => {
    const auth = event.context.auth as Session
    if (!auth) {
        throw createError({ statusCode: 401, message: '未登录' })
    }
    const dataSource = await getDataSource()
    const repo = dataSource.getRepository(User)
    const user = await repo.findOneBy({ id: auth.id })
    if (!user) {
        throw createError({ statusCode: 404, message: '用户不存在' })
    }
    await sendVerifyEmail(user.id, user.email)
    return createApiResponse(null, 200, '验证邮件已发送，请查收')
})
