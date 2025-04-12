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
                            @click="refresh"
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
import { type Order, getStatusText, getStatusColor, type OrderStatus } from '@/types/order'
import { formatDate, formatCurrency } from '@/utils/format'
import type { ApiResponse } from '@/server/types/api'

const route = useRoute()
const refreshing = ref(false)
const error = ref('')

// 订单数据
const { data: order, refresh } = await useAsyncData<Order>(
    'order',
    () => $fetch<ApiResponse<{ order: Order }>>(`/api/orders/${route.params.id}`)
        .then((response) => response.data?.order || {} as any)
        .catch((err: any) => {
            error.value = err.message || '获取订单失败'
            throw err
        }),
)

// 自动轮询更新状态
const { pause, resume } = useIntervalFn(async () => {
    if (!order.value) {
        return
    }
    refreshing.value = true
    try {
        await refresh()
    } catch (err: any) {
        error.value = err.message || '刷新订单状态失败'
        pause()
    } finally {
        refreshing.value = false
    }
}, 5000)

// 组件挂载时开始轮询
onMounted(() => {
    if (order.value && ['PAID', 'FAILED', 'EXPIRED'].includes(order.value.status)) {
        pause()
    } else {
        resume()
    }
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
</script>

<style scoped>
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
</style>
