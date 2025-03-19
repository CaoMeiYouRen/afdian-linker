import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
})

// 数据库连接状态管理
let isConnected = false

export async function connectDB() {
    if (!isConnected) {
        await prisma.$connect()
        isConnected = true
        console.log('成功连接到数据库')
    }
    return prisma
}

export async function disconnectDB() {
    if (isConnected) {
        await prisma.$disconnect()
        isConnected = false
        console.log('数据库连接已关闭')
    }
}

// 健康检查
export async function checkDBHealth() {
    try {
        await prisma.$queryRaw`SELECT 1`
        return true
    } catch (error) {
        console.error('数据库健康检查失败:', error)
        return false
    }
}

export default prisma
