import { Entity, Column } from 'typeorm'
import { BaseEntity } from './BaseEntity'

@Entity('webhook_log')
export class WebhookLog extends BaseEntity {
    @Column({ type: 'jsonb', nullable: false })
    payload: any
}
