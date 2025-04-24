import { hash } from 'bcrypt'
import {
    Entity,
    Column,
    OneToMany,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm'
import { Order } from './order'
import { BaseEntity } from './base-entity'
import { UserRole, type BaseUser } from '@/types/user'

export { UserRole }

// 用户实体
@Entity('user')
export class User extends BaseEntity implements BaseUser {

    // 用户名
    @Column({ type: 'varchar', unique: true, length: 255 })
    username: string

    // 昵称
    @Column({ type: 'varchar', length: 255, nullable: true })
    nickname: string

    // 邮箱
    @Column({ type: 'varchar', unique: true, length: 255 })
    email: string

    // 密码
    @Column({ type: 'varchar', length: 255, select: false })
    password: string

    @BeforeInsert()
    @BeforeUpdate()
    private async hashPassword() {
        if (this.password) {
            this.password = await hash(this.password, 10)
        }
    }

    // 角色
    @Column({
        type: 'enum',
        enum: UserRole,
        enumName: 'user_role_enum',
        default: UserRole.USER,
    })
    role: UserRole

    // 是否是初始密码
    @Column({ type: 'boolean', default: true })
    initialPassword: boolean

    /**
    * @deprecated 弃用，改为判断 emailVerified
    * @description 是否是初始邮箱
     */
    @Column({ type: 'boolean', default: true })
    initialEmail: boolean

    // 是否已验证邮箱
    @Column({ type: 'boolean', default: false, nullable: true })
    emailVerified: boolean

    @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
    auth0Id?: string

    @OneToMany(() => Order, (order) => order.user, {
        cascade: true,
    })
    orders: Order[]
}
