import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { BaseEntity } from './base-entity'
import { Order } from './order'
import { BasePlan } from '@/types/plan'

/**
 * productType: 0=常规方案, 1=售卖方案
 * skuDetail: 仅售卖方案，数组，包含skuId/skuName/quantity等
 */
@Entity('plan')
export class Plan extends BaseEntity implements BasePlan {

    @Column({ type: 'varchar', length: 50, default: 'afdian' })
    paymentChannel: string

    @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
    channelPlanId: string

    @Column({ type: 'varchar', length: 64 })
    title: string

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: string

    @Column({ type: 'varchar', length: 8, default: 'CNY' })
    currency: string

    @Column({ type: 'int', default: 0 })
    productType: number

    @Column({ type: 'int', nullable: true })
    month?: number

    @Column({ type: 'json', nullable: true })
    skuDetail?: any[]

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    showAmount?: string

    @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
    discount?: string

    @Column({ type: 'text', nullable: true })
    description?: string

    @Column({ type: 'boolean', default: true })
    enabled: boolean

    @OneToMany(() => Order, (order) => order.user, {
        cascade: true,
    })
    orders: Order[]

}
