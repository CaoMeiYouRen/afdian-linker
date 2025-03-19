import prisma from '@/server/utils/prisma'
import { useAfdian } from '@/composables/useAfdian'

export default defineEventHandler(async (event) => {
    try {
        await prisma.$connect()
        const { client } = useAfdian()
        const params = getQuery(event)

        const result = await client.queryOrder({
            page: Number(params.page),
            per_page: Number(params.per_page),
        })

        // 批量更新逻辑
        const transactions = result.data.list.map((order) => prisma.order.upsert({
            where: { custom_order_id: order.custom_order_id },
            update: {
                status: order.status === 2 ? 'PAID' : 'FAILED',
                channel_order_id: order.out_trade_no,
            },
            create: {
                id: order.custom_order_id,
                payment_channel: 'afdian',
                custom_order_id: order.custom_order_id,
                status: 'PAID',
                amount: order.total_amount,
                currency: 'CNY',
                channel_order_id: order.out_trade_no,
            },
        }),
        )

        await prisma.$transaction(transactions)

        return {
            code: 200,
            data: {
                count: result.data.list.length,
                success: true,
            },
        }

    } catch (error) {
        console.error('同步失败:', error)
        return {
            code: 500,
            data: {
                success: false,
                message: '订单同步失败',
            },
        }
    } finally {
        await prisma.$disconnect()
    }
})
