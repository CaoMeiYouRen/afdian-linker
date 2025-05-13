<template>
    <v-container>
        <v-row justify="center">
            <v-col
                cols="12"
                sm="8"
                md="6"
            >
                <v-card v-if="order" class="mt-4">
                    <v-card-title class="text-h5">
                        订单详情
                    </v-card-title>

                    <v-card-text>
                        <dl class="details">
                            <dt>订单号</dt>
                            <dd>{{ order.id }}</dd>

                            <dt>商品名称</dt>
                            <dd>{{ order.plan?.title }}</dd>

                            <dt>商品描述</dt>
                            <dd>{{ order.plan?.description }}</dd>

                            <dt>支付渠道</dt>
                            <dd>{{ formatChannel(order.paymentChannel) }}</dd>

                            <dt>金额</dt>
                            <dd>{{ formatCurrency(order.amount, order.currency) }}</dd>

                            <dt>支付状态</dt>
                            <dd>
                                <v-chip
                                    :color="getStatusColor(order.status)"
                                    text-color="white"
                                >
                                    {{ getStatusText(order.status) }}
                                </v-chip>
                            </dd>

                            <dt>创建时间</dt>
                            <dd>{{ formatDate(order.createdAt) }}</dd>

                            <dt>更新时间</dt>
                            <dd>{{ formatDate(order.updatedAt) }}</dd>
                        </dl>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn
                            color="primary"
                            variant="outlined"
                            block
                            :loading="refreshing"
                            @click="handleRefresh"
                        >
                            刷新状态
                        </v-btn>
                    </v-card-actions>
                </v-card>

                <v-alert
                    v-else-if="error"
                    type="error"
                    class="mt-4"
                >
                    {{ error }}
                </v-alert>

                <v-progress-circular
                    v-else
                    indeterminate
                    color="primary"
                    size="64"
                    class="mt-4"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import { useToast } from 'primevue/usetoast'
import { type Order, getStatusText, getStatusColor, type OrderStatus } from '@/types/order'
import { formatDate, formatCurrency, formatChannel } from '@/utils/format'
import type { ApiResponse } from '@/server/types/api'

const toast = useToast()
const route = useRoute()
const refreshing = ref(false)
const error = ref('')

// 订单数据
const { data: order, refresh } = await useAsyncData<Order>(
    'order',
    async () => {
        try {
            refreshing.value = true
            const response = await $fetch<ApiResponse<{ order: Order } >>(`/api/orders/${route.params.id}`)
            return response.data?.order || {} as any
        } catch (err: any) {
            error.value = err.message || '获取订单失败'
            throw err
        } finally {
            refreshing.value = false
        }
    },
)

const pollCount = ref(0)
const MAX_POLL_COUNT = 60 // 最多轮询 60 次

// 自动轮询更新状态
const { pause, resume } = useIntervalFn(async () => {
    // if (!order.value) {
    //     return
    // }

    // if (pollCount.value >= MAX_POLL_COUNT) {
    //     error.value = '订单状态查询超时，请刷新页面重试'
    //     pause()
    //     return
    // }

    // refreshing.value = true
    // try {
    //     await refresh()
    //     pollCount.value++
    // } catch (err: any) {
    //     error.value = err.message || '刷新订单状态失败'
    //     pause()
    // } finally {
    //     refreshing.value = false
    // }
}, 8000)

// 组件挂载时开始轮询
onMounted(() => {
    refresh()
    // if (order.value && ['PAID', 'FAILED', 'EXPIRED'].includes(order.value.status)) {
    //     pause()
    // } else {
    //     resume()
    // }
})

// 组件卸载时停止轮询
onUnmounted(() => {
    pause()
})

// 订单完成后停止轮询
watch(() => order.value?.status, (newStatus: OrderStatus | undefined) => {
    if (newStatus && ['PAID', 'FAILED', 'EXPIRED'].includes(newStatus)) {
        pause()
    } else {
        resume()
    }
})

// 手动刷新时重置计数器
const handleRefresh = async () => {
    pollCount.value = 0
    await refresh()
}
</script>

<style lang="scss" scoped>
@import "@/assets/responsive.scss";

.details {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 12px 24px;
    align-items: center;
}
.details dt {
    color: rgba(0, 0, 0, 0.6);
    font-weight: 500;
}
.details dd {
    margin: 0;
}

@media (max-width: 600px) {
    .details {
        grid-template-columns: 1fr;
        gap: 8px 0;
    }
    .details dt {
        margin-top: 8px;
        font-size: 15px;
    }
    .details dd {
        font-size: 15px;
        margin-bottom: 8px;
    }
}
</style>
