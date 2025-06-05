import { defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/server/entities/user'
import { createApiResponse } from '@/server/types/api'
import { sendResetPasswordEmail } from '@/server/utils/email'

const schema = z.object({
    email: z.string().email('邮箱格式不正确').min(1, '邮箱不能为空').max(255, '邮箱长度不能超过255个字符'),
}).strict()

export default defineEventHandler(async (event) => {
    try {
        const body = schema.parse(await readBody(event))
        const email = body.email.trim()
        const dataSource = await getDataSource()
        const userRepo = dataSource.getRepository(User)
        const user = await userRepo.findOneBy({ email })
        if (!user || !user.emailVerified) {
            // 不泄露信息，统一返回
            return createApiResponse(null, 200, '如果该邮箱已注册且已验证，将收到重置密码邮件')
        }
        await sendResetPasswordEmail(user)
        return createApiResponse(null, 200, '如果该邮箱已注册且已验证，将收到重置密码邮件')
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
