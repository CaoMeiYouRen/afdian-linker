import type { BaseFields, DateToString } from './base'

export interface BaseWebhookLog {
    payload?: any
}

export interface WebhookLog extends BaseWebhookLog, DateToString<BaseFields> { }
// export type CreateWebhookLogDto = PartialFields<WebhookLog, 'id' | 'createdAt' | 'updatedAt'>
// export type UpdateWebhookLogDto = Partial<WebhookLog>
