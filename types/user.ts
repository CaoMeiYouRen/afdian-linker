import type { BaseFields, PartialFields } from './base'

// 用户角色枚举
export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

// 基础用户接口
export interface BaseUser extends BaseFields {
    username: string
    nickname: string
    email: string
    role: UserRole
}

export type User = BaseUser

// 用于创建/更新用户的类型
export type CreateUserDto = PartialFields<User, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateUserDto = Partial<CreateUserDto>

