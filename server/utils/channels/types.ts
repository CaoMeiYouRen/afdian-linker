import { Order } from '@/entities/order'

export interface OrderUpdate {
    status: string
    channelOrderId: string
    rawData: any
}

export interface PaymentChannel {
    generatePayUrl(order: Order): Promise<string>
    handleWebhook(data: any): Promise<OrderUpdate>
}
