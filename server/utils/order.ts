import { randomBytes, randomUUID } from 'crypto'

/**
 * 生成订单ID
 * @param prefix 订单前缀
 * @returns 唯一订单ID
 */
export function generateOrderId(prefix: string = ''): string {
    const uuid = randomUUID({})
    return `${prefix.toLowerCase()}-${uuid}`
}
