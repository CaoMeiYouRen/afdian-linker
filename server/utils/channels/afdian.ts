import { createHash } from 'crypto'
import type { PaymentChannel, OrderUpdate } from './types'
import type { Order } from '@/server/entities/order'

interface AfdianConfig {
    afdianPlanId: string
    afdianUserId: string
    afdianToken: string
    afdianProductType?: string
}

export class AfdianChannel implements PaymentChannel {
    private getConfig(): AfdianConfig {
        const config = useRuntimeConfig()
        const required = ['afdianPlanId', 'afdianUserId', 'afdianToken']
        const missing = required.filter((key) => !config[key])

        if (missing.length > 0) {
            throw new Error(`Missing required Afdian config: ${missing.join(', ')}`)
        }

        return config as unknown as AfdianConfig
    }

    private generateSign(params: Record<string, any>): string {
        const config = this.getConfig()
        const sortedParams = Object.keys(params)
            .sort()
            .map((k) => `${k}${params[k]}`)
            .join('')

        return createHash('md5')
            .update(config.afdianToken + sortedParams)
            .digest('hex')
    }

    async generatePayUrl(order: Order): Promise<string> {
        const config = this.getConfig()
        const params = new URLSearchParams({
            plan_id: config.afdianPlanId,
            custom_order_id: order.customOrderId,
            product_type: config.afdianProductType || '0', // product_type 0表示常规方案 1表示售卖方案
            month: order.metaData?.month?.toString() || '1',
            remark: encodeURIComponent(order.metaData?.remark || ''),
        })
        return `https://afdian.com/order/create?${params}`
    }

    async handleWebhook(data: any): Promise<OrderUpdate> {
        // 验证签名
        const sign = this.generateSign(data.data)
        if (sign !== data.sign) {
            throw new Error('Invalid Afdian webhook signature')
        }

        const orderData = data.data.order
        return {
            status: orderData.status === 2 ? 'PAID' : 'FAILED',
            channelOrderId: orderData.out_trade_no,
            rawData: orderData,
        }
    }
}
