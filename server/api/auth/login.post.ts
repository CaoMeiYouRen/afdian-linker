import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // 验证输入格式
    if (!body.username || !body.password) {
        throw createError({
            statusCode: 400,
            message: '用户名和密码不能为空',
        })
    }

    // 查找用户
    const user = await event.context.prisma.user.findUnique({
        where: { username: body.username },
    })

    // 验证用户存在性
    if (!user) {
        throw createError({
            statusCode: 401,
            message: '用户不存在',
        })
    }

    // 验证密码
    const passwordValid = await bcrypt.compare(body.password, user.password_hash)
    if (!passwordValid) {
        throw createError({
            statusCode: 401,
            message: '密码错误',
        })
    }

    // 验证管理员权限
    if (user.role !== 'ADMIN') {
        throw createError({
            statusCode: 403,
            message: '仅限管理员登录',
        })
    }

    // 设置会话
    // await useSession(event, {
    //     id: user.id,
    //     role: user.role,
    //     initialPassword: user.initial_password,
    // })

    return {
        success: true,
        requirePasswordChange: user.initial_password,
    }
})
