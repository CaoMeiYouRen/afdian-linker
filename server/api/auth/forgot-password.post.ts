import crypto from 'crypto'
import { defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/server/entities/user'
import { createApiResponse } from '@/server/types/api'
import { sendResetPasswordEmail } from '@/server/utils/email'

const schema = z.object({
    email: z.string().email('邮箱格式不正确').min(1, '邮箱不能为空'),
}).strict()

export default defineEventHandler(async (event) => {
    const body = schema.parse(await readBody(event))
    const email = body.email.trim()
    const dataSource = await getDataSource()
    const repo = dataSource.getRepository(User)
    const user = await repo.findOneBy({ email })
    if (!user || !user.emailVerified) {
        // 不泄露信息，统一返回
        return createApiResponse(null, 200, '如果该邮箱已注册且已验证，将收到重置密码邮件')
    }
    // 生成一次性token
    // const token = crypto.randomBytes(32).toString('hex')
    // const expires = Date.now() + 1000 * 60 * 30 // 30分钟有效
    // await repo.update({ id: user.id }, { resetPasswordToken: token, resetPasswordTokenExpires: expires })
    // await sendResetPasswordEmail(user.email, token)
    // return createApiResponse(null, 200, '如果该邮箱已注册且已验证，将收到重置密码邮件')
})
