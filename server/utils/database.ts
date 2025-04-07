import { DataSource } from 'typeorm'
import { Order } from '@/entities/Order'
import { User, UserRole } from '@/entities/User'
import { WebhookLog } from '@/entities/WebhookLog'

let AppDataSource: DataSource = null as any

// 连接状态
let isInitialized = false

export const initializeDB = async () => {
    if (!isInitialized) {
        try {
            AppDataSource = new DataSource({
                type: 'postgres',
                url: process.env.DATABASE_URL,
                entities: [Order, User, WebhookLog],
                synchronize: process.env.NODE_ENV !== 'production',
                logging: process.env.NODE_ENV === 'development',
                ssl: false,
                extra: {
                    max: 20,
                    connectionTimeoutMillis: 60000,
                },
                cache: false,
            })
            await AppDataSource.initialize()
            isInitialized = true
            console.log('数据库连接已初始化')
        } catch (error) {
            console.error('数据库初始化失败:', error)
            throw error
        }
    }
    return AppDataSource
}

export const initAdmin = async () => {
    if (!isInitialized) {
        await initializeDB()
    }
    const userRepository = AppDataSource.getRepository(User)
    const adminUser = await userRepository.findOneBy({ username: 'admin' })
    if (!adminUser) {
        const newAdminUser = userRepository.create({
            username: 'admin',
            nickname: '管理员',
            password: 'admin',
            role: UserRole.ADMIN,
            created_at: new Date(),
            updated_at: new Date(),
        })
        await userRepository.save(newAdminUser)
        console.log('管理员用户已创建:', newAdminUser)
        return newAdminUser
    }
    console.log('管理员用户已存在:', adminUser)
    return adminUser
}

export const getDataSource = async () => {
    if (!isInitialized) {
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
