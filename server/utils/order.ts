import { randomBytes, randomUUID } from 'crypto'
import { pick } from 'lodash-es'
import { MetaData } from '@/types/order'
/**
 * 生成订单ID
 * @param prefix 订单前缀
 * @returns 唯一订单ID
 */
export function generateOrderId(prefix: string = ''): string {
    const uuid = randomUUID({})
    return `${prefix.toLowerCase()}-${uuid}`
}

export function getOrderMetaData(data: any) {
    const _data = pick(data, [
        'plan_id',
        'plan_title',
        'user_id',
        'user_name',
        'product_type',
        'remark',
        'redeem_id',
        'user_private_id',
        'month',
    ]) as MetaData
    _data.product_type = Number(_data.product_type)
    return _data
}
