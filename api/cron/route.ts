import type { VercelRequest, VercelResponse } from '@vercel/node'
import { syncAfdianOrders } from '@/server/utils/syncAfdianOrders'

export default async function handler(
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

    // 调用同步函数
    try {
        const result = await syncAfdianOrders({ page: 1, per_page: 100 })
        response.status(200).json({ success: true, ...result })
    } catch (error: any) {
        response.status(500).json({ success: false, message: error?.message || '同步失败' })
    }
}
