import { defineEventHandler, readBody } from 'h3'
import { z, ZodError } from 'zod'
import { getDataSource } from '@/server/utils/database'
import { User, UserRole } from '@/server/entities/user'
import { sendVerifyEmail } from '@/server/utils/email'
import { createApiResponse } from '@/server/types/api'

const schema = z.object({
    username: z.string().min(1, '用户名不能为空').max(255),
    nickname: z.string().min(1, '昵称不能为空').max(255),
    email: z.string().email('邮箱格式不正确').min(1, '邮箱不能为空').max(255),
    password: z.string().min(6, '密码长度至少为6位').max(255),
})

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { username, nickname, email, password } = schema.parse(body)

        const dataSource = await getDataSource()
        const repo = dataSource.getRepository(User)
        // 检查用户名和邮箱唯一性
        const existUser = await repo.findOneBy([{ username }, { email }])
        if (existUser) {
            throw createError({ statusCode: 400, message: '用户名或邮箱已被占用' })
        }

        const user = repo.create({
            username,
            nickname,
            email,
            password,
            role: UserRole.USER,
            initialPassword: false,
            initialEmail: false,
            emailVerified: false,
        })
        await repo.save(user)

        // 发送邮箱验证邮件
        await sendVerifyEmail(user)

        return createApiResponse(null, 200, '注册成功，请查收验证邮件')
    } catch (error: any) {
        if (error instanceof ZodError) {
            throw createError({
                statusCode: 400,
                message: error.issues.map((e) => e.message).join(', '),
                data: error.issues,
            })
        }
        throw error
    }
})
