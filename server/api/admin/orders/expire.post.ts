import dayjs from 'dayjs'
import { LessThan } from 'typeorm'
import { getDataSource } from '@/server/utils/database'
import { Order, OrderStatus } from '@/server/entities/order'
import { createApiResponse } from '@/server/types/api'

export default defineEventHandler(async (event) => {
    const dataSource = await getDataSource()
    const orderRepository = dataSource.getRepository(Order)
    // 过期时间为当前时间减去2小时
    const expireDate = dayjs().subtract(2, 'hours').toDate()

    // 查找所有超时未支付订单
    const expiredOrders = await orderRepository.find({
        where: {
            status: OrderStatus.PENDING,
            createdAt: LessThan(expireDate),
        },
    })

    const count = expiredOrders.length
    if (expiredOrders.length > 0) {
        // 更新订单状态为已过期
        orderRepository.save(
            expiredOrders.map((order) => {
                order.status = OrderStatus.EXPIRED
                return order
            }),
        )
    }

    return createApiResponse({
        count,
    })
})
