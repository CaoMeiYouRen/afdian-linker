import type { User, UserRole } from './entity'
import type { PartialFields } from './base'

export type { User, UserRole }

// 用于创建/更新用户的类型
export type CreateUserDto = PartialFields<User, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateUserDto = Partial<CreateUserDto>

