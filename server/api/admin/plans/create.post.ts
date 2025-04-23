import { z } from 'zod'
import { createError } from 'h3'
import { getDataSource } from '@/server/utils/database'
import { Plan } from '@/server/entities/plan'
import { Session } from '@/server/utils/session'
import { createApiResponse } from '@/server/types/api'

const planSchema = z.object({
    paymentChannel: z.string().default('afdian').optional(),
    channelPlanId: z.string(),
    title: z.string().min(1),
    amount: z.number().positive(),
    currency: z.string().min(1).max(10).default('CNY').optional(),
    productType: z.number().int().refine((v) => v === 0 || v === 1).default(0),
    month: z.number().int().min(1).max(36).optional(),
    skuDetail: z.array(z.unknown()).optional(),
    showAmount: z.number().positive().optional(),
    discount: z.number().min(0).max(10).optional(),
    description: z.string().optional(),
    enabled: z.boolean().default(true),
})

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const data = await planSchema.parseAsync(body)
        const dataSource = await getDataSource()
        const planRepository = dataSource.getRepository(Plan)
        const plan = planRepository.create({
            ...data,
            amount: data.amount.toFixed(2),
            showAmount: data.showAmount?.toFixed(2),
            discount: data.discount?.toFixed(2),
        })
        await planRepository.save(plan)
        return createApiResponse(plan)
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                message: error.issues.map((e) => e.message).join(', '),
                data: error.issues,
            })
        }
        throw error
    }
})
