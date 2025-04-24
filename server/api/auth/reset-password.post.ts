import { defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { hash } from 'bcrypt'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/server/entities/user'
import { createApiResponse } from '@/server/types/api'

const schema = z.object({
    token: z.string().min(1, '无效的重置链接'),
    password: z.string().min(6, '密码长度至少为6位'),
}).strict()

export default defineEventHandler(async (event) => {
    // const body = schema.parse(await readBody(event))
    // const { token, password } = body
    // const dataSource = await getDataSource()
    // const repo = dataSource.getRepository(User)
    // const user = await repo.findOneBy({ resetPasswordToken: token })
    // if (!user || !user.resetPasswordTokenExpires || user.resetPasswordTokenExpires < Date.now()) {
    //     throw createError({ statusCode: 400, message: '重置链接已失效或无效' })
    // }
    // // 重置密码并清除token
    // await repo.update({ id: user.id }, {
    //     password: await hash(password, 10),
    //     initialPassword: false,
    // })
    // return createApiResponse(null, 200, '密码重置成功')
})
