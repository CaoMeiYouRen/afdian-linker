import bcrypt from 'bcrypt'
import { connectDB, disconnectDB } from '@/server/utils/prisma'

async function main() {
    const adminPassword = await bcrypt.hash('admin123', 10)
    const prisma = await connectDB()
    // await prisma.user.create({
    //     username: 'admin',
    //     password_hash: adminPassword,
    //     role: 'ADMIN',
    //     initial_password: true,
    // })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await disconnectDB()
    })
