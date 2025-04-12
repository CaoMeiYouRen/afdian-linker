<template>
    <v-container>
        <v-row justify="center">
            <v-col
                cols="12"
                sm="8"
                md="6"
            >
                <v-card class="mb-4">
                    <v-card-title class="text-center text-h5">
                        支持我们的工作
                    </v-card-title>

                    <v-card-text>
                        <v-row class="mb-4">
                            <v-col
                                v-for="plan in plans"
                                :key="plan.months"
                                cols="12"
                                sm="4"
                            >
                                <v-card
                                    :color="selectedPlan?.id === plan.id ? 'primary' : ''"
                                    :variant="selectedPlan?.id === plan.id ? 'elevated' : 'outlined'"
                                    :class="[
                                        'h-100',
                                        {'selected-plan': selectedPlan?.id === plan.id}
                                    ]"
                                    @click="selectedPlan = plan"
                                >
                                    <v-card-title class="text-center">
                                        {{ plan.title }}
                                    </v-card-title>
                                    <v-card-text :class="{'text-white': selectedPlan?.id === plan.id}" class="text-center">
                                        <div class="mb-2 text-h4">
                                            <span v-if="plan.originalAmount" class="mr-2 text-body-1 text-decoration-line-through text-grey">
                                                ¥{{ plan.originalAmount }}
                                            </span>
                                            ¥{{ plan.amount }}
                                        </div>
                                        <div class="text-body-2">
                                            {{ plan.months }} 个月
                                            <v-chip
                                                v-if="plan.discount"
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

                            <v-alert
                                v-if="error"
                                type="error"
                                class="mb-4"
                                closable
                            >
                                {{ error }}
                            </v-alert>

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

interface Plan {
    id: string // 新增 id 字段
    title: string
    amount: number | string
    months: number
    description: string
    originalAmount?: number | string
    discount?: number | string
}

// 商品配置
const plans: Plan[] = [
    {
        id: 'monthly',
        title: '月度支持',
        amount: 30,
        months: 1,
        description: '基础支持，获得爱发电徽章',
    },
    // {
    //     id: 'quarterly',
    //     title: '季度支持',
    //     amount: 90,
    //     // originalAmount: 90,
    //     months: 3,
    //     // discount: 8.9,
    //     description: '专属支持，获得专属徽章',
    // },
    {
        id: 'semiannually',
        title: '半年支持',
        amount: 169,
        originalAmount: 180,
        months: 6,
        // discount: (169.2 / 180 * 10).toFixed(1),
        description: '最受欢迎，获得所有特权',
    },
    {
        id: 'yearly',
        title: '年度支持',
        amount: 324,
        originalAmount: 360,
        months: 12,
        // discount: (324 / 360 * 10).toFixed(1),
        description: '最优惠，获得所有特权',
    },
].map((plan) => ({
    ...plan,
    amount: Number(plan.amount),
    originalAmount: plan.originalAmount ? Number(plan.originalAmount) : undefined,
    discount: plan.originalAmount ? (Number(plan.amount) / Number(plan.originalAmount) * 10).toFixed(1) : undefined,
}))

const toast = useToast()
const loading = ref(false)
const error = ref('')
const isValid = ref(false)
const selectedPlan = ref<Plan | null>(null)
const remark = ref('')

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
        error.value = '请选择支持方案'
        return
    }

    loading.value = true
    error.value = ''

    try {
        const { data } = await useFetch('/api/orders/create', {
            method: 'POST',
            body: {
                amount: selectedPlan.value.amount,
                months: selectedPlan.value.months,
                remark: remark.value,
                channel: 'afdian',
            },
        })

        if (data.value?.statusCode === 200 && data.value.data) {
            const { orderId, paymentUrl } = data.value.data
            handleOrderCreated(orderId, paymentUrl)
            return
        }
        error.value = data.value?.message || '创建订单失败'
    } catch (err: any) {
        error.value = err.message || '创建订单失败'
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error.value,
            life: 5000,
        })
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.v-card:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease;
}

.selected-plan {
    border: 2px solid rgb(var(--v-theme-primary));
}

.selected-plan :deep(.v-card-title) {
    color: white;
}

.selected-plan .text-grey {
    color: rgba(255, 255, 255, 0.7) !important;
}
</style>
