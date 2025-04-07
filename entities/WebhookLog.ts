import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('webhook_log')
export class WebhookLog {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'jsonb', nullable: false })
    payload: any

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date
}
