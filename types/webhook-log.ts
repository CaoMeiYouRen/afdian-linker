import type { BaseFields, PartialFields } from './base'

export interface BaseWebhookLog extends BaseFields {
    payload?: any
}

export type WebhookLog = BaseWebhookLog
// export type CreateWebhookLogDto = PartialFields<WebhookLog, 'id' | 'createdAt' | 'updatedAt'>
// export type UpdateWebhookLogDto = Partial<WebhookLog>
