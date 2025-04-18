import { defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/server/entities/user'
import { sendVerifyEmail } from '@/server/utils/email'
import { createApiResponse } from '@/server/types/api'

const schema = z.object({
    email: z.string().email('邮箱格式不正确').min(1, '邮箱不能为空'),
}).strict()

export default defineEventHandler(async (event) => {
    const auth = event.context.auth as Session
    if (!auth) {
        throw createError({ statusCode: 401, message: '未登录' })
    }
    const body = await readValidatedBody(event, schema.parse)
    const email = body?.email?.trim()

    const dataSource = await getDataSource()
    const repo = dataSource.getRepository(User)
    // 检查邮箱是否已被占用
    const exist = await repo.findOneBy({ email })
    if (exist && exist.id !== auth.id) {
        throw createError({ statusCode: 400, message: '邮箱已被占用' })
    }
    await repo.update({ id: auth.id }, { email, emailVerified: false })
    // 发送验证邮件
    await sendVerifyEmail(auth.id, email)
    return createApiResponse(null, 200, '邮箱修改成功，请查收验证邮件')
})
