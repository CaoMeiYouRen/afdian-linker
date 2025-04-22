import type { BaseFields, DateToString, PartialFields } from './base'
import type { User } from './user'

export interface BasePlan {
    // 支付渠道
    paymentChannel: string
    // 渠道方案ID
    // 唯一标识，不能重复
    channelPlanId: string
    // 方案名称
    title: string
    // 实际金额
    amount: string
    // 货币类型
    currency: string
    // 0=常规方案, 1=售卖方案
    productType: number
    // 月数
    month?: number
    // 显示金额
    showAmount?: string
    // 折扣，0-10
    discount?: string
    // 备注
    description?: string
    enabled: boolean
    // 售卖方案，数组
    skuDetail?: any[]
}

export interface Plan extends BasePlan, DateToString<BaseFields> {
    _enabling?: boolean
    user?: Partial<User | null>

}
