import type { DateToString } from './base'
import type { BaseOrder, BaseUser, OrderStatus, UserRole } from './shared'

// 导出基础类型
export type Order = BaseOrder
export type User = BaseUser

// 导出枚举
export type { OrderStatus, UserRole }

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
