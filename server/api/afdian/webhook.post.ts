import type { EventHandler } from 'h3'
import { AfdianWebhookResponse } from '@cao-mei-you-ren/afdian'
import { getDataSource } from '@/server/utils/database'
import { Order, OrderStatus } from '@/server/entities/order'
import { WebhookLog } from '@/server/entities/webhook-log'
import { getOrderMetaData } from '@/server/utils/order'
import { batchPushAllInOne } from '@/server/utils/push'

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
        // 记录 webhook 日志
        const logRepo = dataSource.getRepository(WebhookLog)
        await logRepo.save({
            payload: body,
        })
        if (!body?.data?.order?.custom_order_id) {
            return {
                ec: 200,
                em: '处理成功',
            }
        }

        const orderData = body.data.order
        const desp = `
订单号: ${orderData.custom_order_id}
平台订单号: ${orderData.out_trade_no}
用户ID: ${orderData.user_id}
方案ID: ${orderData.plan_id}
购买月数: ${orderData.month}
金额: ${orderData.total_amount} 元
订单状态: ${orderData.status === 2 ? '已支付' : '未支付/失败'}
备注: ${orderData.remark || '-'}
优惠: ${orderData.discount || '-'}
商品类型: ${orderData.product_type}
收货人: ${orderData.address_person || '-'}
收货电话: ${orderData.address_phone || '-'}
收货地址: ${orderData.addres_address || '-'}
`.trim()
        await batchPushAllInOne('新订单通知', desp)

        await dataSource.transaction(async (manager) => {
            // 保存订单
            const existingOrder = await manager.findOne(Order, {
                where: { customOrderId: orderData.custom_order_id },
            })

            if (existingOrder) {
                existingOrder.channelOrderId = orderData.out_trade_no
                existingOrder.status = orderData.status === 2 ? OrderStatus.PAID : OrderStatus.FAILED
                existingOrder.rawData = orderData
                existingOrder.metaData = {
                    ...existingOrder.metaData,
                    ...getOrderMetaData(orderData),
                }
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
                    metaData: getOrderMetaData(orderData),
                })
                await manager.save(newOrder)
            }

        })

        return {
            ec: 200,
            em: '处理成功',
        }

    } catch (error: any) {
        console.error('Webhook处理失败:', error)
        return {
            ec: 500,
            em: error?.message || '服务器内部错误',
        }
    }
})
