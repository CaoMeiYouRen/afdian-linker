import type { BaseFields, DateToString, PartialFields } from './base'
import type { PaymentChannelType } from './channel'
import type { BaseUser, User } from './user'

// 订单状态枚举
export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    EXPIRED = 'EXPIRED',
}

export interface MetaData {
    // 商品/套餐ID
    plan_id: string
    // 商品/套餐名称
    plan_title: string
    // 用户ID。这里指爱发电用户的ID
    user_id: string
    // 用户昵称。这里指爱发电用户的昵称
    user_name: string
    // 0表示常规方案 1表示售卖方案
    product_type: number
    // 备注
    remark: string
    // 兑换码ID
    redeem_id: string
    // 用户私有ID
    user_private_id: string
    // 月数
    month: number
}

// 基础订单接口
export interface BaseOrder {
    // 自定义订单ID。用于关联本系统和爱发电订单
    customOrderId: string
    // 实际支付金额
    amount: string
    // 货币类型
    currency: string
    // 订单状态
    status: OrderStatus
    // 订单渠道
    paymentChannel: PaymentChannelType
    // 订单渠道ID
    channelOrderId: string
    userId?: string
}

export interface Order extends BaseOrder, DateToString<BaseFields> {
    user?: Partial<User | null>
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

