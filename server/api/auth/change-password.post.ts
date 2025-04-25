import { z } from 'zod'
import bcrypt from 'bcrypt'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/server/entities/user'
import { createApiResponse } from '@/server/types/api'
import { rateLimit } from '@/server/utils/rate-limit'

const schema = z.object({
    oldPassword: z.string().min(1).max(255),
    newPassword: z.string().min(6).max(255), // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
})

export default defineEventHandler(async (event) => {
    try {
        const body = schema.parse(await readBody(event))
        const userId = event.context.auth.id

        const dataSource = await getDataSource()
        const userRepo = dataSource.getRepository(User)

        const user = await userRepo.createQueryBuilder('user')
            .where({ id: userId })
            .addSelect('user.password')
            .getOne()

        if (!user || !await bcrypt.compare(body.oldPassword, user.password)) {
            throw createError({
                statusCode: 401,
                message: '当前密码不正确',
            })
        }

        await userRepo.update(userId, {
            password: await bcrypt.hash(body.newPassword, 10),
            initialPassword: false,
        })

        return createApiResponse({ success: true }, 200, '密码修改成功')
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

