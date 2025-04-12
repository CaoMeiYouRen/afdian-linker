import { z } from 'zod'
import { createError } from 'h3'
import { getDataSource } from '@/server/utils/database'
import { Order } from '@/entities/Order'
import { verifyApiKey } from '@/server/utils/auth'
import { ApiResponse, createApiResponse } from '@/server/types/api'

export default defineEventHandler(async (event) => {

    const orderId = getRouterParam(event, 'id')
    if (!orderId) {
        throw createError({
            statusCode: 400,
            message: '订单ID不能为空',
        })
    }

    const dataSource = await getDataSource()
    const orderRepository = dataSource.getRepository(Order)

    const order = await orderRepository.findOne({
        where: [
            { id: orderId },
            { customOrderId: orderId },
        ],
    })

    if (!order) {
        throw createError({
            statusCode: 404,
            message: '订单不存在',
        })
    }

    return createApiResponse({
        order: {
            id: order.id,
            customOrderId: order.customOrderId,
            status: order.status,
            amount: Number(order.amount),
            currency: order.currency,
            paymentChannel: order.paymentChannel,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        },
    })
})
