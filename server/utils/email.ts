import crypto from 'crypto'
import nodemailer from 'nodemailer'
import dayjs from 'dayjs'
import { escapeHtml } from './html'
import { VerificationCode } from '@/server/entities/verification-code'

type UserEmailInfo = {
    id: string
    username: string
    email: string
}

export async function sendVerifyEmail(user: UserEmailInfo) {
    const config = useRuntimeConfig()
    const { username, email, id } = user
    const dataSource = await getDataSource()
    const codeRepo = dataSource.getRepository(VerificationCode)
    // 生成一次性token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = dayjs().add(1, 'hour') // 1小时有效

    // 保存验证码
    await codeRepo.save(codeRepo.create({
        code: token,
        type: 'email_verify',
        userId: id,
        used: false,
        expiresAt: expires.toDate(),
    }))

    const verifyUrl = `${config.baseUrl}/api/user/email-verify-callback?token=${token}`

    const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpSecure, // true for 465, false for other ports
        auth: {
            user: config.smtpUser,
            pass: config.smtpPass,
        },
    } as any)

    if (!await transporter.verify()) {
        throw createError({
            statusCode: 500,
            message: 'SMTP配置错误',
        })
    }

    await transporter.sendMail({
        from: config.smtpFrom,
        to: email,
        subject: '邮箱验证',
        html: `<p>尊敬的用户 <b>${escapeHtml(username)}</b>，</p>
    <p>感谢您使用我们的服务！为了确保您的账户安全，请完成邮箱验证。</p>
    <p>请点击下方链接完成邮箱验证：</p>
    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
    <p>如果无法点击链接，请将上面的链接复制到浏览器地址栏中打开。</p>
    <p>链接在1小时内有效，请尽快完成验证。</p>
    <p>如果不是您本人操作，请忽略此邮件。</p>`,
    })
}

export async function sendResetPasswordEmail(user: UserEmailInfo) {
    const config = useRuntimeConfig()

    const dataSource = await getDataSource()
    const codeRepo = dataSource.getRepository(VerificationCode)
    // 生成一次性token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = dayjs().add(30, 'minutes')// 30分钟有效

    // 保存验证码
    await codeRepo.save(codeRepo.create({
        code: token,
        type: 'reset_password',
        user,
        used: false,
        expiresAt: expires.toDate(),
    }))
    const resetUrl = `${config.baseUrl}/reset-password?token=${token}`
    const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpSecure, // true for 465, false for other ports
        auth: {
            user: config.smtpUser,
            pass: config.smtpPass,
        },
    } as any)

    if (!await transporter.verify()) {
        throw createError({
            statusCode: 500,
            message: 'SMTP配置错误',
        })
    }
    await transporter.sendMail({
        from: config.smtpFrom,
        to: user.email,
        subject: '重置您的密码',
        html: `<p>尊敬的用户 <b>${escapeHtml(user.username)}</b>，</p>
    <p>我们收到了您的重置密码请求。请点击下方链接重置您的账户密码：</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>该链接30分钟内有效，且仅可使用一次。请勿将此邮件或链接转发给他人。</p>
    <p>如果您未发起此请求，请立即忽略本邮件，并建议及时修改账户密码以保障账户安全。</p>
    <p>感谢您的配合与支持！</p>`,
    })
}
