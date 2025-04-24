import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm'
import { User } from './user'
import { BaseEntity } from './base-entity'

@Entity()
export class VerificationCode extends BaseEntity {

    @Column({ type: 'varchar', length: 255 })
    code: string

    @Column({ type: 'varchar', length: 50 })
    type: string // 如 'reset_password', 'email_verify'

    @Column({ type: 'boolean', default: false })
    used: boolean

    @Column({ type: 'timestamp with time zone' })
    expiresAt: Date

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User

    @Column({ type: 'uuid', nullable: true })
    userId: string

}
