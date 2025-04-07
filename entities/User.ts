import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm'
import { Order } from './Order'

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true, length: 255 })
    username: string

    @Column({ length: 100 })
    nickname: string

    @Column({ unique: true, length: 255 })
    email: string

    @Column({ length: 255 })
    password_hash: string

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole

    @Column({ type: 'boolean', default: true })
    initial_password: boolean

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date

    @OneToMany(() => Order, (order) => order.user, {
        cascade: true,
    })
    orders: Order[]
}
