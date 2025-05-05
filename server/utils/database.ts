import { DataSource } from 'typeorm'
import { SnakeCaseNamingStrategy } from './naming-strategy'
import { VerificationCode } from '@/server/entities/verification-code'
import { Order } from '@/server/entities/order'
import { User, UserRole } from '@/server/entities/user'
import { WebhookLog } from '@/server/entities/webhook-log'
import { Plan } from '@/server/entities/plan'

let AppDataSource: DataSource = null as any

// 连接状态
let isInitialized = false

export const initializeDB = async () => {
    if (!isInitialized) {
        try {
            AppDataSource = new DataSource({
                type: 'postgres',
                url: process.env.DATABASE_URL,
                entities: [Order, User, WebhookLog, Plan, VerificationCode],
                synchronize: process.env.NODE_ENV !== 'production',
                logging: process.env.NODE_ENV === 'development',
                ssl: false,
                extra: {
                    max: 20,
                    connectionTimeoutMillis: 60000,
                },
                cache: false,
                // 所有表（或集合）加的前缀
                entityPrefix: process.env.ENTITY_PREFIX || 'afdian_',
                // 表、字段命名策略，改为 snake_case
                namingStrategy: new SnakeCaseNamingStrategy(),
            })
            await AppDataSource.initialize()
            isInitialized = true
            console.log('数据库连接已初始化')
            await initAdmin()
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
            password: process.env.ADMIN_PASSWORD || '123456', // 初始密码
            email: process.env.ADMIN_EMAIL || 'admin@example.com', // 初始邮箱
            initialPassword: !process.env.ADMIN_PASSWORD, // 是否需要修改初始密码
            initialEmail: !process.env.ADMIN_EMAIL, // 是否需要修改初始邮箱
            emailVerified: false, // 是否已验证邮箱
            role: UserRole.ADMIN,
        })
        await userRepository.save(newAdminUser)
        console.log('管理员用户已创建:', newAdminUser.id)
        return newAdminUser
    }
    console.log('管理员用户已存在:', adminUser.id)
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
        const dataSource = await getDataSource()
        await dataSource.query('SELECT 1')
        return true
    } catch (error) {
        console.error('数据库健康检查失败:', error)
        return false
    }
}

export default AppDataSource
