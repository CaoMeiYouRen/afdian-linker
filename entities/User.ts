import {
    Entity,
    Column,
    OneToMany,
} from 'typeorm'
import { Order } from './Order'
import { BaseEntity } from './BaseEntity'

// 用户角色枚举
export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

// 用户实体
@Entity('user')
export class User extends BaseEntity {

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
    initialPassword: boolean

    @OneToMany(() => Order, (order) => order.user, {
        cascade: true,
    })
    orders: Order[]
}
