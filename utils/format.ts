import dayjs from 'dayjs'
import type { PaymentChannelType } from '~/types/channel'

export const formatDate = (date: string | Date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')

export const formatCurrency = (amount: number | string, currency: string) => new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: currency || 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
}).format(Number(amount))

export const formatChannel = (channel: PaymentChannelType) => {
    const channelMap: Record<PaymentChannelType, string> = {
        alipay: '支付宝',
        wechat: '微信',
        stripe: 'Stripe',
        paypal: 'PayPal',
        applepay: 'Apple Pay',
        afdian: '爱发电',
        patreon: 'Patreon',
    }
    return channelMap[channel] || channel
}
