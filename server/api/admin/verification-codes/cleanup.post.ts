import { defineEventHandler } from 'h3'
import { createApiResponse } from '@/server/types/api'
import { cleanupVerificationCodes } from '@/server/utils/verification-codes/cleanup'

export default defineEventHandler(async (event) => {
    const { count, message } = await cleanupVerificationCodes()
    return createApiResponse({ count }, 200, message)
})
