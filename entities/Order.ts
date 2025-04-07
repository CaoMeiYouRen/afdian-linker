import { Entity, Column, ManyToOne } from 'typeorm'
import { User } from './User'
import { BaseEntity } from './BaseEntity'

export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    EXPIRED = 'EXPIRED',
}

@Entity('order')
export class Order extends BaseEntity {
    @Column({ type: 'varchar', length: 50, default: 'afdian' })
    paymentChannel: string

    @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
    channelOrderId: string

    @Column({ type: 'varchar', length: 255, unique: true })
    customOrderId: string

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
    rawData: any

    @Column({ type: 'jsonb', nullable: true })
    metadata: any

    @ManyToOne(() => User, (user) => user.orders)
    user: User
}
