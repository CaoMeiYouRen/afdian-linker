import { LessThan } from 'typeorm'
import { getDataSource } from '@/server/utils/database'
import { VerificationCode } from '@/server/entities/verification-code'

/**
 * @description 清理过期或已使用的验证码
 *
 * @author CaoMeiYouRen
 * @date 2025-05-04
 * @export
 */
export async function cleanupVerificationCodes() {
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

    return {
        count: result.length,
        message: `已删除 ${result.length} 条无效验证码`,
    }
}
