import { createApiResponse } from '@/server/types/api'
import { expirePendingOrders } from '@/server/utils/orders/expire'

export default defineEventHandler(async (event) => {
    const { count, message } = await expirePendingOrders()
    return createApiResponse({ count }, 200, message)
})
