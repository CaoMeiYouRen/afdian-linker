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
                                    :color="selectedPlan === plan ? 'primary' : ''"
                                    :variant="selectedPlan === plan ? 'elevated' : 'outlined'"
                                    class="h-100"
                                    @click="selectedPlan = plan"
                                >
                                    <v-card-title class="text-center">
                                        {{ plan.title }}
                                    </v-card-title>
                                    <v-card-text class="text-center">
                                        <div class="mb-2 text-h4">
                                            ¥{{ plan.amount }}
                                        </div>
                                        <div class="text-body-2">
                                            {{ plan.months }} 个月
                                        </div>
                                        <div class="text-caption text-grey">
                                            {{ plan.description }}
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>

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
    title: string
    amount: number
    months: number
    description: string
}

// 商品配置
const plans: Plan[] = [
    {
        title: '月度支持',
        amount: 30,
        months: 1,
        description: '基础支持，获得爱发电徽章',
    },
    {
        title: '季度支持',
        amount: 80,
        months: 3,
        description: '节省10元，获得专属徽章',
    },
    {
        title: '年度支持',
        amount: 298,
        months: 12,
        description: '最优惠，获得所有特权',
    },
]

const toast = useToast()
const loading = ref(false)
const error = ref('')
const isValid = ref(false)
const selectedPlan = ref<Plan | null>(null)
const remark = ref('')

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

        if (data.value?.statusCode === 200) {
            // 跳转到爱发电支付页面
            if (data.value.data?.paymentUrl) {
                window.open(data.value.data.paymentUrl, '_blank')
            }
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
