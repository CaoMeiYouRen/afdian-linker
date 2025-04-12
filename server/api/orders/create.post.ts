import { z } from 'zod'
import { createError } from 'h3'
import { getDataSource } from '@/server/utils/database'
import { Order, OrderStatus } from '@/entities/Order'
import { generateOrderId } from '@/server/utils/order'
import { paymentChannels } from '@/server/utils/channels'
import { ApiResponse, createApiResponse } from '@/server/types/api'

// 创建订单参数验证
const orderSchema = z.object({
    amount: z.number().positive(),
    channel: z.string().default('afdian'),
    customId: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
    months: z.number().int().min(1).max(120).default(1),
    remark: z.string().max(200).optional(),
})

export default defineEventHandler(async (event): Promise<ApiResponse> => {
    try {
        const body = await readBody(event)
        const data = await orderSchema.parseAsync(body)

        const dataSource = await getDataSource()
        const orderRepository = dataSource.getRepository(Order)

        // 生成订单
        const order = orderRepository.create({
            // id: generateOrderId(data.channel),
            paymentChannel: data.channel,
            customOrderId: data.customId || generateOrderId(data.channel),
            amount: data.amount.toFixed(2),
            status: OrderStatus.PENDING,
            currency: 'CNY',
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

    } catch (error) {
        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                message: '参数验证失败',
                data: error.issues,
            })
        }
        throw error
    }
})
