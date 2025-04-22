import { Entity, Column, ManyToOne } from 'typeorm'
import { User } from './user'
import { BaseEntity } from './base-entity'
import { Plan } from './plan'
import { OrderStatus, type BaseOrder, type MetaData } from '@/types/order'

export { OrderStatus }

@Entity('order')
export class Order extends BaseEntity implements BaseOrder {
    @Column({ type: 'varchar', length: 50, default: 'afdian' })
    paymentChannel: string

    @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
    channelOrderId: string

    @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
    customOrderId: string

    @Column({
        type: 'enum',
        enum: OrderStatus,
        enumName: 'order_status_enum',
        default: OrderStatus.PENDING,
    })
    status: OrderStatus

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: string

    @Column({ type: 'varchar', length: 8, default: 'CNY' })
    currency: string

    @Column({ type: 'jsonb', nullable: true })
    rawData: any

    @Column({ type: 'jsonb', nullable: true })
    metaData: MetaData

    @ManyToOne(() => User, (user) => user.orders)
    user: User

    @Column({ type: 'uuid', nullable: true })
    userId: string

    @ManyToOne(() => Plan, (plan) => plan.orders)
    plan: Plan

    @Column({ type: 'uuid', nullable: true })
    planId: string
}
