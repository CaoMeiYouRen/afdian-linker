import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('webhook_log')
export class WebhookLog {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('jsonb')
    payload: any

    @CreateDateColumn()
    created_at: Date
}
