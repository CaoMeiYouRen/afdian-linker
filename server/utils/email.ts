import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import { useRuntimeConfig } from '#imports'

export async function sendVerifyEmail(userId: string, email: string) {
    const config = useRuntimeConfig()
    const token = jwt.sign({ id: userId, email }, config.jwtSecret, { expiresIn: '1h' })
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
               <p>如果无法点击链接，请将上面的链接复制到浏览器地址栏中打开。</p>
               <p>链接在1小时内有效，请尽快完成验证。</p>
               <p>如果不是您本人操作，请忽略此邮件。</p>`,
    })
}
