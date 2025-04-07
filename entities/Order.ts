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

    @Column({ type: 'varchar', length: 50, default: 'afdian' })
    payment_channel: string

    @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
    channel_order_id: string

    @Column({ type: 'varchar', length: 255, unique: true })
    custom_order_id: string

    @Column({
        type: 'enum',
        enum: OrderStatus,
        enumName: 'order_status_enum',
        default: OrderStatus.PENDING,
    })
    status: OrderStatus

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number

    @Column({ type: 'varchar', length: 8, default: 'CNY' })
    currency: string

    @Column({ type: 'jsonb', nullable: true })
    raw_data: any

    @Column({ type: 'jsonb', nullable: true })
    metadata: any

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date

    @ManyToOne(() => User, (user) => user.orders)
    user: User
}
