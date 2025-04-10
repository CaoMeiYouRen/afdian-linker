import type { PaymentChannel } from './types'
import { AfdianChannel } from './afdian'

export const paymentChannels: Record<string, PaymentChannel> = {
    afdian: new AfdianChannel(),
}

export type { PaymentChannel, OrderUpdate } from './types'
