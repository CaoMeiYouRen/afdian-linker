import { z } from 'zod'
import { createError } from 'h3'
import { getDataSource } from '@/server/utils/database'
import { Plan } from '@/server/entities/plan'
import { Session } from '@/server/utils/session'
import { createApiResponse } from '@/server/types/api'

const planSchema = z.object({
    paymentChannel: z.string().default('afdian').optional(),
    channelPlanId: z.string(),
    title: z.string().min(1).optional(),
    amount: z.number().positive().optional(),
    productType: z.number().int().refine((v) => v === 0 || v === 1).optional(),
    month: z.number().int().min(1).max(36).optional(),
    skuDetail: z.array(z.object({
        skuId: z.string(),
        skuName: z.string(),
        quantity: z.number().int().min(1),
    })).optional(),
    showAmount: z.number().positive().optional(),
    discount: z.number().min(0).max(10).optional(),
    description: z.string().optional(),
    enabled: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
    const planId = getRouterParam(event, 'id')
    const body = await readBody(event)
    const data = await planSchema.parseAsync(body)
    const dataSource = await getDataSource()
    const planRepository = dataSource.getRepository(Plan)
    const plan = await planRepository.findOneBy({ id: planId })
    if (!plan) {
        throw createError({ statusCode: 404, message: '方案不存在' })
    }
    await planRepository.save({
        ...plan,
        ...data,
        amount: data.amount?.toFixed(2),
        showAmount: data.showAmount?.toFixed(2),
        discount: data.discount?.toFixed(2),
    })
    return createApiResponse(plan)
})
