import { z } from 'zod'
import bcrypt from 'bcrypt'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/entities/user'
import { createApiResponse } from '@/server/types/api'

const schema = z.object({
    oldPassword: z.string().min(1),
    newPassword: z.string().min(6), // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
})

export default defineEventHandler(async (event) => {
    try {
        const body = await readValidatedBody(event, schema.parse)
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
                message: '密码格式不正确',
                data: error.issues,
            })
        }
        throw error
    }
})

