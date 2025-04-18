import { defineEventHandler, getQuery, sendRedirect } from 'h3'
import jwt from 'jsonwebtoken'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/server/entities/user'
import { createApiResponse } from '@/server/types/api'

export default defineEventHandler(async (event) => {
    const { token } = getQuery(event)
    if (!token) {
        // 跳转到中间页并标记失败，附带错误信息
        return sendRedirect(event, '/email-verify?status=fail&message=无效的验证链接', 302)
    }
    const config = useRuntimeConfig()
    try {
        const payload = jwt.verify(token as string, config.jwtSecret) as { id: string, email: string }
        const dataSource = await getDataSource()
        const repo = dataSource.getRepository(User)
        const user = await repo.findOneBy({ id: payload.id })
        if (!user) {
            return sendRedirect(event, '/email-verify?status=fail&message=用户不存在', 302)
        }
        if (user.email !== payload.email) {
            return sendRedirect(event, '/email-verify?status=fail&message=邮箱已变更，请重新验证', 302)
        }
        await repo.update({ id: user.id }, { emailVerified: true })
        // 跳转到邮箱验证成功的中间页
        return sendRedirect(event, '/email-verify?status=success', 302)
    } catch (e: any) {
        console.error(e)
        // 跳转到邮箱验证失败的中间页，附带错误信息
        const msg = encodeURIComponent(e?.message || '验证链接已失效或无效')
        return sendRedirect(event, `/email-verify?status=fail&message=${msg}`, 302)
    }
})
