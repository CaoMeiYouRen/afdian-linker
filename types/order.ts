import type { BaseFields, DateToString } from './base'

// 订单状态枚举
export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    EXPIRED = 'EXPIRED',
}

// 基础订单接口
export interface BaseOrder {
    customOrderId: string
    amount: string
    currency: string
    status: OrderStatus
    paymentChannel: string
    channelOrderId?: string
    userId?: string
}

export interface Order extends BaseOrder, DateToString<BaseFields> {

}

// 状态映射类型
export const orderStatusMap = {
    PENDING: '待支付',
    PAID: '支付成功',
    FAILED: '支付失败',
    EXPIRED: '已过期',
} as const

export const orderStatusColorMap = {
    PENDING: 'warning',
    PAID: 'success',
    FAILED: 'error',
    EXPIRED: 'grey',
} as const

export type OrderStatusText = typeof orderStatusMap[keyof typeof orderStatusMap]
export type OrderStatusColor = typeof orderStatusColorMap[keyof typeof orderStatusColorMap]

// 获取展示用的文本和颜色
export const getStatusText = (status: OrderStatus) => orderStatusMap[status] || status
export const getStatusColor = (status: OrderStatus) => orderStatusColorMap[status] || 'default'

