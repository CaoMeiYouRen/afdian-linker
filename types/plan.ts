import type { BaseFields, DateToString, PartialFields } from './base'

export interface BasePlan {
    title: string
    // 实际金额
    amount: number
    // 货币类型
    currency: string
    // 0=常规方案, 1=售卖方案
    productType: number
    // 月数
    month?: number
    // 显示金额
    showAmount?: number
    // 折扣
    discount?: number
    // 备注
    description?: string
    enabled: boolean
    // 售卖方案，数组
    skuDetail?: any[]
}

export interface Plan extends BasePlan, DateToString<BaseFields> {
    _enabling?: boolean
}
