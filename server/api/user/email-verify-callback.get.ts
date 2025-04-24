import { defineEventHandler, getQuery, sendRedirect } from 'h3'
import jwt from 'jsonwebtoken'
import { MoreThanOrEqual } from 'typeorm'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/server/entities/user'
import { VerificationCode } from '@/server/entities/verification-code'
import { createApiResponse } from '@/server/types/api'

export default defineEventHandler(async (event) => {
    const { token } = getQuery(event)
    if (!token) {
        // 跳转到中间页并标记失败，附带错误信息
        return sendRedirect(event, '/email-verify?status=fail&message=无效的验证链接', 302)
    }
    const config = useRuntimeConfig()
    try {
        const dataSource = await getDataSource()
        const codeRepo = dataSource.getRepository(VerificationCode)
        const userRepo = dataSource.getRepository(User)

        // 优先查找 VerificationCode
        const code = await codeRepo.findOne({
            where: {
                code: token as string,
                type: 'email_verify',
                used: false,
                expiresAt: MoreThanOrEqual(new Date()),
            },
            relations: ['user'],
        })

        if (code && code.user) {
            // 校验通过，标记已用并设置邮箱已验证
            await userRepo.update({ id: code.user.id }, { emailVerified: true })
            code.used = true
            await codeRepo.save(code)
            return sendRedirect(event, '/email-verify?status=success', 302)
        }

        // 兼容老逻辑（jwt token）
        let payload: any
        try {
            payload = jwt.verify(token as string, config.jwtSecret) as { id: string, email: string }
        } catch (e) {
            return sendRedirect(event, '/email-verify?status=fail&message=验证链接已失效或无效', 302)
        }
        const user = await userRepo.findOneBy({ id: payload.id })
        if (!user) {
            return sendRedirect(event, '/email-verify?status=fail&message=用户不存在', 302)
        }
        if (user.email !== payload.email) {
            return sendRedirect(event, '/email-verify?status=fail&message=邮箱已变更，请重新验证', 302)
        }
        await userRepo.update({ id: user.id }, { emailVerified: true })
        // 跳转到邮箱验证成功的中间页
        return sendRedirect(event, '/email-verify?status=success', 302)
    } catch (e: any) {
        console.error(e)
        // 跳转到邮箱验证失败的中间页，附带错误信息
        const msg = encodeURIComponent(e?.message || '验证链接已失效或无效')
        return sendRedirect(event, `/email-verify?status=fail&message=${msg}`, 302)
    }
})
