import type { PaymentChannelType } from '~/types/channel'

export const getChannelColor = (channel: PaymentChannelType) => {
    const channelColors: Record<PaymentChannelType, string> = {
        alipay: '#1677ff',
        wechat: '#09BB07',
        stripe: '#635bff',
        paypal: '#0544b5',
        applepay: '#000000',
        afdian: '#946ce6',
        patreon: '#FF424D',
    }
    return channelColors[channel] || '#000000'
}
