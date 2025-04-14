// 订单状态枚举
export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    EXPIRED = 'EXPIRED',
}

// 用户角色枚举
export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

// 基础用户接口
export interface BaseUser {
    id: string
    username: string
    nickname: string
    email: string
    role: UserRole
    createdAt: string
    updatedAt: string
}

// 基础订单接口
export interface BaseOrder {
    id: string
    customOrderId: string
    amount: string
    currency: string
    status: OrderStatus
    paymentChannel: string
    paymentUrl?: string
    createdAt: string
    updatedAt: string
}
