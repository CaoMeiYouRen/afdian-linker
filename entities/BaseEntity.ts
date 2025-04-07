import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date
}
