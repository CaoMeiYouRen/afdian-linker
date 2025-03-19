import prisma from '@/server/utils/prisma'

export default defineEventHandler(async (event) => {
    try {
        await prisma.$connect()
        const body = await readBody(event)

        // 验证必要字段
        if (!body?.data?.order?.custom_order_id) {
            throw createError({
                statusCode: 400,
                message: '无效的Webhook数据',
            })
        }

        const orderData = body.data.order

        // 使用事务处理数据库操作
        await prisma.$transaction([
            prisma.order.upsert({
                where: { custom_order_id: orderData.custom_order_id },
                update: {
                    channel_order_id: orderData.out_trade_no,
                    status: orderData.status === 2 ? 'PAID' : 'FAILED',
                    raw_data: orderData,
                },
                create: {
                    payment_channel: 'afdian',
                    custom_order_id: orderData.custom_order_id,
                    channel_order_id: orderData.out_trade_no,
                    status: 'PAID',
                    amount: orderData.total_amount,
                    currency: 'CNY',
                    raw_data: orderData,
                },
            }),
            prisma.webhookLog.create({
                data: {
                    payload: body,
                },
            }),
        ])

        return {
            ec: 200,
            em: '处理成功',
            data: {
                order_id: orderData.custom_order_id,
                status: orderData.status === 2 ? 'PAID' : 'FAILED',
            },
        }

    } catch (error: any) {
        console.error('Webhook处理失败:', error)
        return {
            ec: 500,
            em: '服务器内部错误',
            data: {
                error: error?.message,
            },
        }
    } finally {
        await prisma.$disconnect()
    }
})
