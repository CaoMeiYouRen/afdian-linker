export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    await event.context.prisma.$transaction([
        event.context.prisma.order.update({
            where: { id: body.data.order.custom_order_id },
            data: {
                afdian_id: body.data.order.out_trade_no,
                status: body.data.order.status === 2 ? 'PAID' : 'FAILED',
                paid_at: new Date(),
            },
        }),
        event.context.prisma.webhookLog.create({
            data: { payload: JSON.stringify(body) },
        }),
    ])

    return { ec: 200, em: '' }
})
