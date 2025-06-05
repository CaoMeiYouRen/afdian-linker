import crypto from 'crypto'
import { defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import dayjs from 'dayjs'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/server/entities/user'
import { sendVerifyEmail } from '@/server/utils/email'
import { createApiResponse } from '@/server/types/api'
import { rateLimit } from '@/server/utils/rate-limit'
import { VerificationCode } from '@/server/entities/verification-code'

const schema = z.object({
    email: z.string().email('邮箱格式不正确').min(1, '邮箱不能为空').max(255, '邮箱长度不能超过255个字符'),
}).strict()

export default defineEventHandler(async (event) => {
    const auth = event.context.auth as Session
    if (!auth) {
        throw createError({ statusCode: 401, message: '未登录' })
    }
    try {
        const body = schema.parse(await readBody(event))
        const email = body?.email?.trim()

        const dataSource = await getDataSource()
        const repo = dataSource.getRepository(User)
        const codeRepo = dataSource.getRepository(VerificationCode)
        // 检查邮箱是否已被占用
        const exist = await repo.findOneBy({ email })
        if (exist && exist.id !== auth.id) {
            throw createError({ statusCode: 400, message: '邮箱已被占用' })
        }

        const user = await repo.findOneBy({ id: auth.id })
        if (!user) {
            throw createError({ statusCode: 404, message: '用户不存在' })
        }

        await repo.update({ id: auth.id }, { email, emailVerified: false })

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

        // 发送验证邮件
        await sendVerifyEmail(user)

        return createApiResponse(null, 200, '邮箱修改成功，请查收验证邮件')
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                message: error.issues.map((e) => e.message).join(', '),
                data: error.issues,
            })
        }
        throw error
    }
})
