import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import { useRuntimeConfig } from '#imports'

export async function sendVerifyEmail(userId: string, email: string) {
    const config = useRuntimeConfig()
    const token = jwt.sign({ id: userId, email }, config.jwtSecret, { expiresIn: '1d' })
    const verifyUrl = `${config.baseUrl}/api/user/email-verify-callback?token=${token}`

    const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpSecure, // true for 465, false for other ports
        auth: {
            user: config.smtpUser,
            pass: config.smtpPass,
        },
    })

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
        html: `<p>请点击下方链接完成邮箱验证：</p>
               <p><a href="${verifyUrl}">${verifyUrl}</a></p>
               <p>如果不是您本人操作，请忽略此邮件。</p>`,
    })
}
