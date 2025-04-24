import { defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { hash } from 'bcrypt'
import { MoreThanOrEqual } from 'typeorm'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/server/entities/user'
import { VerificationCode } from '@/server/entities/verification-code'
import { createApiResponse } from '@/server/types/api'
import { rateLimit } from '@/server/utils/rate-limit'

const schema = z.object({
    token: z.string().min(1, '无效的重置链接').max(255, '重置链接长度不能超过255个字符'),
    password: z.string().min(6, '密码长度至少为6位').max(255, '密码长度不能超过255个字符'),
}).strict()

export default defineEventHandler(async (event) => {
    try {

        await rateLimit(event, {
            window: 60_000,
            max: 5,
        })
        const body = schema.parse(await readBody(event))
        const { token, password } = body
        const dataSource = await getDataSource()
        const codeRepo = dataSource.getRepository(VerificationCode)
        const userRepo = dataSource.getRepository(User)

        // 查找有效且未用的重置密码验证码
        const code = await codeRepo.findOne({
            where: {
                code: token,
                type: 'reset_password',
                used: false,
                expiresAt: MoreThanOrEqual(new Date()),
            },
            relations: ['user'],
        })

        if (!code || !code.user) {
            throw createError({ statusCode: 400, message: '重置链接已失效或无效' })
        }

        // 重置密码
        await userRepo.update(code.user.id, {
            password: await hash(password, 10),
            initialPassword: false,
        })

        // 标记验证码为已用
        code.used = true
        await codeRepo.save(code)

        return createApiResponse(null, 200, '密码重置成功')
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
