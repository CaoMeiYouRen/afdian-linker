import crypto from 'crypto'
import { defineEventHandler } from 'h3'
import dayjs from 'dayjs'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/server/entities/user'
import { sendVerifyEmail } from '@/server/utils/email'
import { createApiResponse } from '@/server/types/api'
import { rateLimit } from '@/server/utils/rate-limit'
import { VerificationCode } from '@/server/entities/verification-code'

export default defineEventHandler(async (event) => {
    const auth = event.context.auth as Session
    if (!auth) {
        throw createError({ statusCode: 401, message: '未登录' })
    }
    const dataSource = await getDataSource()
    const repo = dataSource.getRepository(User)
    const codeRepo = dataSource.getRepository(VerificationCode)
    const user = await repo.findOneBy({ id: auth.id })
    if (!user) {
        throw createError({ statusCode: 404, message: '用户不存在' })
    }

    // 生成一次性token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = dayjs().add(1, 'hour') // 1小时有效

    // 保存验证码
    await codeRepo.save(codeRepo.create({
        code: token,
        type: 'email_verify',
        userId: auth.id,
        used: false,
        expiresAt: expires.toDate(),
    }))

    await sendVerifyEmail(user.id, user.email, token)
    return createApiResponse(null, 200, '验证邮件已发送，请查收')
})
