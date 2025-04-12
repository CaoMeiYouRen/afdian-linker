<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card class="mb-4">
                    <v-card-title>管理后台</v-card-title>
                    <v-card-text>
                        <p>欢迎 <b>{{ userStore.userInfo?.nickname || '用户' }}</b> 使用爱发电订单管理系统</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            variant="elevated"
                            color="primary"
                            @click="handleBack"
                        >
                            返回首页
                        </v-btn>
                        <v-spacer />
                        <v-btn
                            variant="text"
                            color="primary"
                            :active="route.path === '/admin'"
                            @click="router.push('/admin')"
                        >
                            订单管理
                        </v-btn>
                        <v-btn
                            variant="text"
                            color="primary"
                            :active="route.path === '/admin/users'"
                            @click="router.push('/admin/users')"
                        >
                            用户管理
                        </v-btn>
                        <v-btn
                            variant="text"
                            color="primary"
                            :active="route.path === '/admin/webhooks'"
                            @click="router.push('/admin/webhooks')"
                        >
                            Webhook日志
                        </v-btn>
                    </v-card-actions>
                </v-card>
                <v-card>
                    <v-card-title>最近订单</v-card-title>
                    <v-card-text>
                        <v-data-table
                            :headers="headers"
                            :items="orders"
                            :loading="loading"
                            hover
                        >
                            <template #item.amount="{item}">
                                {{ formatCurrency(item.amount, item.currency) }}
                            </template>
                            <template #item.status="{item}">
                                <v-chip
                                    :color="getStatusColor(item.status)"
                                    text-color="white"
                                >
                                    {{ getStatusText(item.status) }}
                                </v-chip>
                            </template>
                            <template #item.createdAt="{item}">
                                {{ formatDate(item.createdAt) }}
                            </template>
                            <template #item.updatedAt="{item}">
                                {{ formatDate(item.updatedAt) }}
                            </template>
                            <template #item.actions="{item}">
                                <v-btn
                                    icon="mdi-eye"
                                    size="small"
                                    variant="text"
                                    @click="handleOrderClick(item.id)"
                                />
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
definePageMeta({
    // middleware: 'auth',
})

import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user'
import { type Order, getStatusText, getStatusColor } from '@/types/order'
import { formatDate, formatCurrency } from '@/utils/format'

const toast = useToast()
const userStore = useUserStore()
const loading = ref(false)
const orders = ref<Order[]>([])

// 表头定义
interface DataTableHeader {
    title: string
    key: string
    width?: string
    sortable?: boolean
}

const headers: DataTableHeader[] = [
    { title: 'ID', key: 'id', width: '200px' },
    { title: '订单号', key: 'customOrderId', width: '200px' },
    { title: '支付渠道', key: 'paymentChannel', width: '150px' },
    { title: '金额', key: 'amount', width: '120px' },
    { title: '状态', key: 'status', width: '100px' },
    { title: '创建时间', key: 'createdAt', width: '180px' },
    { title: '更新时间', key: 'updatedAt', width: '180px' },
    { title: '操作', key: 'actions', width: '80px', sortable: false },
]

const route = useRoute()
const router = useRouter()

const handleBack = () => {
    navigateTo('/')
}

const handleOrderClick = (orderId: string) => {
    navigateTo(`/orders/${orderId}`)
}

// 获取订单列表
const fetchOrders = async () => {
    loading.value = true
    try {
        const { data } = await useFetch<{
            statusCode: number
            data: { orders: Order[] }
            message?: string
        }>('/api/orders', {
            query: {
                page: 1,
                perPage: 10,
                sort: 'createdAt',
                order: 'DESC',
            },
        })

        if (data.value?.statusCode === 200) {
            orders.value = data.value.data.orders
            return
        }
        throw new Error(data.value?.message || '获取订单列表失败')
    } catch (error: any) {
        console.error('获取订单列表失败:', error)
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error.message || '获取订单列表失败',
            life: 5000,
        })
    } finally {
        loading.value = false
    }
}

// 页面加载时获取订单列表
onMounted(() => {
    fetchOrders()
})
</script>
