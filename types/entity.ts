import type { DateToString } from './base'
import type { Order as OrderEntity } from '@/entities/Order'
import type { User as UserEntity } from '@/entities/User'

// 从实体类型生成前端使用的类型
export type Order = DateToString<OrderEntity>
export type User = DateToString<UserEntity>

// 枚举类型重新导出
export { OrderStatus } from '@/entities/Order'
export { UserRole } from '@/entities/User'

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
