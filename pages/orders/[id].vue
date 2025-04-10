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
                            <dd>{{ order.currency }} {{ order.amount }}</dd>

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

// 订单状态类型
type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED'

interface Order {
    id: string
    status: OrderStatus
    amount: number
    currency: string
    createdAt: string
    updatedAt: string
}

const route = useRoute()
const refreshing = ref(false)
const error = ref('')

// 订单数据
const { data: order, refresh } = await useAsyncData<Order | null>(
    'order',
    () => $fetch<Order>(`/api/orders/${route.params.id}`).catch((err) => {
        error.value = err.message || '获取订单失败'
        return null
    }),
)

// 状态文本映射
const statusMap: Record<OrderStatus, string> = {
    PENDING: '待支付',
    PAID: '支付成功',
    FAILED: '支付失败',
    EXPIRED: '已过期',
}

// 状态颜色映射
const statusColorMap: Record<OrderStatus, string> = {
    PENDING: 'warning',
    PAID: 'success',
    FAILED: 'error',
    EXPIRED: 'grey',
}

// 格式化时间
const formatDate = (date: string) => {
    if (!date) {
        return '-'
    }
    return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(new Date(date))
}

const getStatusText = (status: keyof typeof statusMap) => statusMap[status] || status

const getStatusColor = (status: keyof typeof statusColorMap) => statusColorMap[status] || 'default'

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
