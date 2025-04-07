import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import { User } from './User'

export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    EXPIRED = 'EXPIRED',
}

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ default: 'afdian' })
    payment_channel: string

    @Column({ nullable: true, unique: true })
    channel_order_id: string

    @Column({ unique: true })
    custom_order_id: string

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus

    @Column('decimal')
    amount: number

    @Column({ default: 'CNY' })
    currency: string

    @Column('jsonb', { nullable: true })
    raw_data: any

    @Column('jsonb', { nullable: true })
    metadata: any

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(() => User, (user) => user.orders)
    user: User
}
