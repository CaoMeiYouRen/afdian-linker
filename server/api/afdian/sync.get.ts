import { useAfdian } from '@/composables/useAfdian'

export default defineEventHandler(async (event) => {
    const { client } = useAfdian()
    const params = getQuery(event)

    const result = await client.queryOrder({
        page: Number(params.page),
        per_page: Number(params.per_page),
    })

    // 批量更新逻辑
    // const transactions = result.data.list.map((order) => prisma.order.upsert({
    //     where: { id: order.custom_order_id },
    //     update: {
    //         status: order.status === 2 ? 'PAID' : 'FAILED',
    //         afdian_id: order.out_trade_no,
    //     },
    //     create: {
    //         id: order.custom_order_id,
    //         amount: order.total_amount,
    //         status: 'PAID',
    //         afdian_id: order.out_trade_no,
    //     },
    // }),
    // )

    // await prisma.$transaction(transactions)

    return { count: result.data.list.length }
})
