import { DataSource } from 'typeorm'
import { Order } from '@/entities/Order'
import { User } from '@/entities/User'
import { WebhookLog } from '@/entities/WebhookLog'

let AppDataSource: DataSource = null as any

// 连接状态
let isInitialized = false

export const initializeDB = async () => {
    if (!isInitialized) {
        AppDataSource = new DataSource({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [Order, User, WebhookLog],
            synchronize: process.env.NODE_ENV !== 'production',
            logging: process.env.NODE_ENV === 'development',
        })
        await AppDataSource.initialize()
        isInitialized = true
        console.log('数据库连接已初始化')
    }
    return AppDataSource
}

export const getDataSource = async () => {
    if (!isInitialized) {
        // throw new Error('数据库尚未初始化')
        await initializeDB()
    }
    return AppDataSource
}

export const checkDBHealth = async () => {
    try {
        await AppDataSource.query('SELECT 1')
        return true
    } catch (error) {
        console.error('数据库健康检查失败:', error)
        return false
    }
}

export default AppDataSource
