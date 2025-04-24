import { In } from 'typeorm'
import { getDataSource } from '@/server/utils/database'
import { Order, OrderStatus } from '@/server/entities/order'
import { useAfdian } from '@/server/utils/afdian'
import { createApiResponse } from '@/server/types/api'
import { getOrderMetaData } from '@/server/utils/order'

interface SyncAfdianOrdersParams {
    page?: number
    per_page?: number
}

export async function syncAfdianOrders(params: SyncAfdianOrdersParams = {}) {
    const { page = 1, per_page = 50 } = params
    const dataSource = await getDataSource()
    return dataSource.transaction(async (manager) => {
        const { client } = useAfdian()
        const orderRepository = manager.getRepository(Order)
        const result = await client.queryOrder({ page, per_page })
        if (result.ec !== 200) {
            throw new Error(result.em || '订单同步失败')
        }
        const existingOrders = await orderRepository.find({
            where: [{
                channelOrderId: In(result.data.list.map((order) => order.out_trade_no)),
            }, {
                customOrderId: In(result.data.list.map((order) => order.custom_order_id)),
            }],
        })
        const existingOrdersMap = new Map(
            existingOrders.map((order) => [order.channelOrderId, order]),
        )
        const transactions = result.data.list.map(async (orderData) => {
            const existingOrder = existingOrdersMap.get(orderData.out_trade_no)
            const orderToUpdate = {
                ...existingOrder || {},
                customOrderId: orderData.custom_order_id,
                paymentChannel: 'afdian',
                channelOrderId: orderData.out_trade_no,
                status: orderData.status === 2 ? OrderStatus.PAID : OrderStatus.FAILED,
                amount: orderData.total_amount,
                currency: 'CNY',
                rawData: orderData,
                metaData: {
                    ...existingOrder?.metaData,
                    ...getOrderMetaData(orderData),
                },
            }
            if (existingOrder) {
                if (existingOrder.status === orderToUpdate.status) {
                    return existingOrder
                }
                return orderRepository.save(orderToUpdate)
            }
            return orderRepository.save(orderToUpdate)
        })
        const orders = await Promise.all(transactions)
        return createApiResponse({
            orders: orders.map((o) => ({ id: o.id, status: o.status })),
            count: orders.length,
        })
    })
}
