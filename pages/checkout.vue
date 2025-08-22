<template>
    <v-container>
        <v-row justify="center">
            <v-col
                cols="12"
                sm="8"
            >
                <v-card class="mb-4">
                    <v-card-title class="text-center text-h5">
                        支持我们的工作
                    </v-card-title>

                    <v-card-text>
                        <v-row class="mb-4">
                            <v-col
                                v-if="plansLoading"
                                cols="12"
                            >
                                <v-skeleton-loader type="card" />
                            </v-col>
                            <v-col
                                v-else-if="plansError"
                                cols="12"
                            >
                                <v-alert type="error" dense>
                                    {{ plansError }}
                                </v-alert>
                            </v-col>
                            <template v-else>
                                <v-col
                                    v-for="plan in plans"
                                    :key="plan.id"
                                    cols="12"
                                    sm="4"
                                    md="3"
                                >
                                    <v-card
                                        :color="selectedPlan?.id === plan.id ? 'primary' : ''"
                                        :variant="selectedPlan?.id === plan.id ? 'elevated' : 'outlined'"
                                        :class="[
                                            'h-100',
                                            'plan-card'
                                        ]"
                                        @click="selectedPlan = plan"
                                    >
                                        <v-card-title class="text-center">
                                            {{ plan.title }}
                                        </v-card-title>
                                        <v-card-text :class="{'text-white': selectedPlan?.id === plan.id}" class="text-center">
                                            <div class="mb-2 text-h4">
                                                <span
                                                    v-if="plan.showAmount && plan.showAmount !== plan.amount"
                                                    class="mr-2 text-body-1 text-decoration-line-through text-grey"
                                                >
                                                    ¥{{ plan.showAmount }}
                                                </span>
                                                ¥{{ plan.amount }}
                                            </div>
                                            <div class="text-body-2">
                                                {{ plan.month }} 个月
                                                <v-chip
                                                    v-if="plan.discount && plan.showAmount !== plan.amount"
                                                    color="success"
                                                    size="small"
                                                    class="ml-2"
                                                >
                                                    {{ plan.discount }}折
                                                </v-chip>
                                            </div>
                                            <div class="text-caption text-grey">
                                                {{ plan.description }}
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </template>
                        </v-row>

                        <v-expansion-panels class="mb-4">
                            <v-expansion-panel>
                                <v-expansion-panel-title>支付说明</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <ol class="pl-4">
                                        <li>选择您想要的支持方案</li>
                                        <li>填写留言（可选）</li>
                                        <li>点击支付按钮将跳转至爱发电付款页面</li>
                                        <li>完成付款后将自动返回本站</li>
                                    </ol>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>

                        <v-form
                            ref="form"
                            v-model="isValid"
                            @submit.prevent="handleSubmit"
                        >
                            <v-textarea
                                v-model="remark"
                                label="留言"
                                rows="3"
                                maxlength="200"
                                counter
                                class="mb-4"
                            />

                            <div class="align-center d-flex justify-space-between mb-4">
                                <div class="text-body-1">
                                    支付金额
                                </div>
                                <div class="text-h5">
                                    ¥{{ selectedPlan?.amount || 0 }}
                                </div>
                            </div>

                            <v-btn
                                type="submit"
                                color="primary"
                                block
                                size="large"
                                :loading="loading"
                                :disabled="!selectedPlan"
                            >
                                立即支持
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import type { Plan } from '@/types/plan'

const toast = useToast()
const loading = ref(false)
const isValid = ref(false)
const selectedPlan = ref<Plan | null>(null)
const remark = ref('')

const plans = ref<Plan[]>([])
const plansLoading = ref(true)
const plansError = ref('')

// 获取plans
const fetchPlans = async () => {
    plansLoading.value = true
    plansError.value = ''
    try {
        const { data, error: fetchError } = await useFetch('/api/plans', {
            query: {
                sort: 'amount',
                order: 'ASC',
            },
        })
        if (fetchError.value) {
            throw new Error(fetchError.value?.data?.message || fetchError.value?.message || '获取支持方案失败')
        }
        // 兼容分页返回
        const items = data.value?.data.items || []
        plans.value = items.map((plan: any) => ({
            ...plan,
            amount: Number(plan.amount),
            showAmount: plan.showAmount ? Number(plan.showAmount) : undefined,
            discount: plan.showAmount
                ? (Number(plan.amount) / Number(plan.showAmount) * 10).toFixed(1)
                : undefined,
        }))
    } catch (e: any) {
        plansError.value = e.message || '获取支持方案失败'
    } finally {
        plansLoading.value = false
    }
}

onMounted(fetchPlans)

// 成功创建订单后跳转
const handleOrderCreated = (orderId: string, paymentUrl: string) => {
    // 存储订单信息到 localStorage，用于支付后查询
    localStorage.setItem('pendingOrderId', orderId)

    // 在新窗口打开支付链接
    window.open(paymentUrl, '_blank')

    // 跳转到订单详情页
    navigateTo(`/orders/${orderId}`)
}

// 提交订单
const handleSubmit = async () => {
    if (!selectedPlan.value) {
        toast.add({
            severity: 'warning',
            summary: '错误',
            detail: '请选择支持方案',
            life: 5000,
        })
        return
    }

    loading.value = true

    try {
        const { data, error } = await useFetch('/api/orders/create', {
            method: 'POST',
            body: {
                planId: selectedPlan.value.id,
                amount: selectedPlan.value.amount,
                month: selectedPlan.value.month,
                remark: remark.value,
                channel: selectedPlan.value.paymentChannel,
                channelPlanId: selectedPlan.value.channelPlanId,
                productType: selectedPlan.value.productType,
            },
        })

        if (data.value?.statusCode === 200 && data.value.data) {
            const { orderId, paymentUrl } = data.value.data
            handleOrderCreated(orderId, paymentUrl)
            return
        }
        throw new Error(error.value?.data?.message || error.value?.message || '创建订单失败')
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error.message || '创建订单失败',
            life: 5000,
        })
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped>
.v-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: all 0.2s ease;
}

.plan-card {
    transition: all 0.2s ease;
}
.plan-card:hover {
    transform: translateY(-2px);
}

.v-card-title {
    flex: 0 0 auto;
}

.v-card-text {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

</style>
