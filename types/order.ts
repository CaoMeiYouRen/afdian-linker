export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED'

export interface Order {
    id: string
    customOrderId?: string
    status: OrderStatus
    amount: number
    currency: string
    paymentChannel?: string
    payUrl?: string
    createdAt: string
    updatedAt: string
}

export const statusMap: Record<OrderStatus, string> = {
    PENDING: '待支付',
    PAID: '支付成功',
    FAILED: '支付失败',
    EXPIRED: '已过期',
}

export const statusColorMap: Record<OrderStatus, string> = {
    PENDING: 'warning',
    PAID: 'success',
    FAILED: 'error',
    EXPIRED: 'grey',
}

export const getStatusText = (status: keyof typeof statusMap) => statusMap[status] || status
export const getStatusColor = (status: keyof typeof statusColorMap) => statusColorMap[status] || 'default'
