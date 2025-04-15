import { Entity, Column } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import type { BaseWebhookLog } from '@/types/webhook-log'

@Entity('webhook_log')
export class WebhookLog extends BaseEntity implements BaseWebhookLog {
    @Column({ type: 'jsonb', nullable: false })
    payload: any
}
