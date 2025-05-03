import { defineEventHandler } from 'h3'
import { LessThan, Equal } from 'typeorm'
import { getDataSource } from '@/server/utils/database'
import { VerificationCode } from '@/server/entities/verification-code'
import { createApiResponse } from '@/server/types/api'

export default defineEventHandler(async (event) => {
    const dataSource = await getDataSource()
    const codeRepo = dataSource.getRepository(VerificationCode)
    const now = new Date()

    // 删除已过期或已使用的验证码
    const codes = await codeRepo.find({
        where: [
            {
                used: true,
            },
            {
                expiresAt: LessThan(now),
            },
        ],
    })
    const result = await codeRepo.remove(codes)

    return createApiResponse({
        count: result.length,
    }, 200, `已删除 ${result.length} 条无效验证码`)
})
