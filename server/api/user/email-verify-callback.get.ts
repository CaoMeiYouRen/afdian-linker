import { defineEventHandler, getQuery } from 'h3'
import jwt from 'jsonwebtoken'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/server/entities/user'

export default defineEventHandler(async (event) => {
    const { token } = getQuery(event)
    if (!token) {
        return { statusCode: 400, message: '无效的验证链接' }
    }
    const config = useRuntimeConfig()
    try {
        const payload = jwt.verify(token as string, config.jwtSecret) as { id: string, email: string }
        const dataSource = await getDataSource()
        const repo = dataSource.getRepository(User)
        const user = await repo.findOneBy({ id: payload.id })
        if (!user) {
            return { statusCode: 404, message: '用户不存在' }
        }
        if (user.email !== payload.email) {
            return { statusCode: 400, message: '邮箱已变更，请重新验证' }
        }
        await repo.update({ id: user.id }, { emailVerified: true })
        return { statusCode: 200, message: '邮箱验证成功' }
    } catch (e) {
        console.error(e)
        return { statusCode: 400, message: '验证链接已失效或无效' }
    }
})
