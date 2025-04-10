import { randomBytes } from 'crypto'

/**
 * 生成订单ID
 * @param prefix 订单前缀
 * @returns 唯一订单ID
 */
export function generateOrderId(prefix: string = ''): string {
    const timestamp = Date.now().toString()
    const random = randomBytes(3).toString('hex')
    return `${prefix.toUpperCase()}_${timestamp}_${random}`
}
