import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    let authHeader: string | undefined
    if (typeof request.headers.authorization === 'string') {
        authHeader = request.headers.authorization
    } else if (Array.isArray(request.headers.authorization)) {
        authHeader = request.headers.authorization[0]
    } else {
        authHeader = undefined
    }
    if (
        !process.env.CRON_SECRET ||
        authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        return response.status(401).json({ success: false })
    }

    response.status(200).json({ success: true })
}
