import { defineEventHandler, readBody } from 'h3'
import { getDataSource } from '@/server/utils/database'
import { User } from '@/server/entities/user'
import { sendVerifyEmail } from '@/server/utils/email'

export default defineEventHandler(async (event) => {
    const auth = event.context.auth as Session
    if (!auth) {
        return { statusCode: 401, message: '未登录' }
    }
    const body = await readBody(event)
    const email = body?.email?.trim()
    if (!email) {
        return { statusCode: 400, message: '邮箱不能为空' }
    }
    // 邮箱格式校验
    if (!/.+@.+\..+/.test(email)) {
        return { statusCode: 400, message: '邮箱格式不正确' }
    }
    const dataSource = await getDataSource()
    const repo = dataSource.getRepository(User)
    // 检查邮箱是否已被占用
    const exist = await repo.findOneBy({ email })
    if (exist && exist.id !== auth.id) {
        return { statusCode: 400, message: '该邮箱已被占用' }
    }
    await repo.update({ id: auth.id }, { email, emailVerified: false })
    // 发送验证邮件
    await sendVerifyEmail(auth.id, email)
    return { statusCode: 200, message: '邮箱修改成功，请查收验证邮件' }
})
