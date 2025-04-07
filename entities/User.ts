import { hash } from 'bcrypt'
import {
    Entity,
    Column,
    OneToMany,
    BeforeInsert,
    BeforeUpdate,
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

    @Column({ type: 'varchar', length: 255, nullable: true })
    nickname: string

    @Column({ type: 'varchar', unique: true, length: 255 })
    email: string

    @Column({ type: 'varchar', length: 255, select: false })
    password: string

    @BeforeInsert()
    @BeforeUpdate()
    private async hashPassword() {
        if (this.password) {
            this.password = await hash(this.password, 10)
        }
    }

    @Column({
        type: 'enum',
        enum: UserRole,
        enumName: 'user_role_enum',
        default: UserRole.USER,
    })
    role: UserRole

    @Column({ type: 'boolean', default: true })
    initialPassword: boolean

    @Column({ type: 'boolean', default: true })
    initialEmail: boolean

    @OneToMany(() => Order, (order) => order.user, {
        cascade: true,
    })
    orders: Order[]
}
