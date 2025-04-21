import { z } from 'zod'
import { createError } from 'h3'
import { getDataSource } from '@/server/utils/database'
import { Plan } from '@/server/entities/plan'
import { Session } from '@/server/utils/session'
import { createApiResponse } from '@/server/types/api'

const planSchema = z.object({
    title: z.string().min(1),
    amount: z.number().positive(),
    productType: z.number().int().refine((v) => v === 0 || v === 1),
    month: z.number().int().min(1).max(36).optional(),
    skuDetail: z.array(z.object({
        skuId: z.string(),
        skuName: z.string(),
        quantity: z.number().int().min(1),
    })).optional(),
    showAmount: z.number().positive().optional(),
    discount: z.number().min(0).max(10).optional(),
    description: z.string().optional(),
    enabled: z.boolean().default(true),
})

export default defineEventHandler(async (event) => {
    const auth = event.context.auth as Session
    if (!auth || auth.role !== 'ADMIN') {
        throw createError({ statusCode: 403, message: '无权限' })
    }
    const body = await readBody(event)
    const data = await planSchema.parseAsync(body)
    const dataSource = await getDataSource()
    const planRepository = dataSource.getRepository(Plan)
    const plan = planRepository.create(data)
    await planRepository.save(plan)
    return createApiResponse(plan)
})
