import { z } from 'zod'
import { createError } from 'h3'
import { getDataSource } from '@/server/utils/database'
import { Order, OrderStatus } from '@/server/entities/order'
import { generateOrderId } from '@/server/utils/order'
import { paymentChannels } from '@/server/utils/channels'
import { ApiResponse, createApiResponse } from '@/server/types/api'
import { Session } from '@/server/utils/session'

// 创建订单参数验证
const orderSchema = z.object({
    amount: z.number().positive(),
    channel: z.string().default('afdian'),
    metaData: z.record(z.unknown()).optional(),
    month: z.number().int().min(1).max(36).default(1),
    remark: z.string().max(255).optional(),
    planId: z.string(),
    channelPlanId: z.string(),
    productType: z.number().int().refine((v) => v === 0 || v === 1).default(0),
})

export default defineEventHandler(async (event) => {
    try {
        const auth = event.context.auth as Session
        const body = await readBody(event)
        const data = await orderSchema.parseAsync(body)

        const dataSource = await getDataSource()
        const orderRepository = dataSource.getRepository(Order)

        // 生成订单
        const order = orderRepository.create({
            paymentChannel: data.channel,
            customOrderId: generateOrderId(data.channel),
            amount: data.amount.toFixed(2),
            status: OrderStatus.PENDING,
            currency: 'CNY',
            metaData: {
                month: data.month,
                remark: data.remark,
                plan_id: data.channelPlanId,
                product_type: Number(data.productType),
            },
            userId: auth.id,
            planId: data.planId,
        })

        // 保存订单
        await orderRepository.save(order)

        // 获取支付渠道处理器
        const channel = paymentChannels[data.channel]
        if (!channel) {
            throw createError({
                statusCode: 400,
                message: `不支持的支付渠道: ${data.channel}`,
            })
        }

        // 生成支付URL
        const paymentUrl = await channel.generatePayUrl(order)

        return createApiResponse({
            orderId: order.id,
            paymentUrl,
        })

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                message: error.issues.map((e) => e.message).join(', '),
                data: error.issues,
            })
        }
        throw error
    }
})
