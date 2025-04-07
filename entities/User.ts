import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm'
import { Order } from './Order'

// 用户角色枚举
export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

// 用户实体
@Entity('user')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', unique: true, length: 255 })
    username: string

    @Column({ type: 'varchar', length: 255 })
    nickname: string

    @Column({ type: 'varchar', unique: true, length: 255 })
    email: string

    @Column({ type: 'varchar', length: 255 })
    password: string

    @Column({
        type: 'enum',
        enum: UserRole,
        enumName: 'user_role_enum',
        default: UserRole.USER,
    })
    role: UserRole

    @Column({ type: 'boolean', default: true })
    initial_password: boolean

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date

    @OneToMany(() => Order, (order) => order.user, {
        cascade: true,
    })
    orders: Order[]
}
