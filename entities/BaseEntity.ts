import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import type { BaseFields } from '@/types/base'

export abstract class BaseEntity implements BaseFields {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date
}
