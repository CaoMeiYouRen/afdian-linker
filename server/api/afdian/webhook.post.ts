import type { EventHandler } from 'h3'
import { AfdianWebhookResponse } from '@cao-mei-you-ren/afdian'
import { getDataSource } from '@/server/utils/database'
import { Order, OrderStatus } from '@/server/entities/order'
import { WebhookLog } from '@/server/entities/webhook-log'

export default defineEventHandler(async (event) => {
    try {
        const webhookToken = useRuntimeConfig().webhookToken
        const query = getQuery(event)
        if (webhookToken !== query.webhookToken) {
            throw createError({
                statusCode: 401,
                message: 'Webhook Token 错误',
            })
        }
        const dataSource = await getDataSource()
        const body = await readBody(event) as AfdianWebhookResponse

        if (!body?.data?.order?.custom_order_id) {
            throw createError({
                statusCode: 400,
                message: '无效的Webhook数据',
            })
        }

        const orderData = body.data.order

        await dataSource.transaction(async (manager) => {
            // 保存订单
            const existingOrder = await manager.findOne(Order, {
                where: { customOrderId: orderData.custom_order_id },
            })

            if (existingOrder) {
                existingOrder.channelOrderId = orderData.out_trade_no
                existingOrder.status = orderData.status === 2 ? OrderStatus.PAID : OrderStatus.FAILED
                existingOrder.rawData = orderData
                await manager.save(existingOrder)
            } else {
                const newOrder = manager.create(Order, {
                    paymentChannel: 'afdian',
                    customOrderId: orderData.custom_order_id,
                    channelOrderId: orderData.out_trade_no,
                    status: orderData.status === 2 ? OrderStatus.PAID : OrderStatus.FAILED,
                    amount: orderData.total_amount,
                    currency: 'CNY',
                    rawData: orderData,
                })
                await manager.save(newOrder)
            }

            // 记录 webhook 日志
            const webhookLog = manager.create(WebhookLog, {
                payload: body,
            })
            await manager.save(webhookLog)
        })

        return {
            ec: 200,
            em: '处理成功',
            // data: {
            //     customOrderId: orderData.custom_order_id,
            //     status: orderData.status === 2 ? 'PAID' : 'FAILED',
            // },
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
    }
})
