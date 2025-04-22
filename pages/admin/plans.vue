<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card class="mb-4">
                    <v-card-title>方案管理</v-card-title>
                    <v-card-text>
                        <v-row align="center">
                            <div>
                                <p>欢迎 <b>{{ userStore.userInfo?.nickname || '用户' }}</b> 使用方案管理后台</p>
                            </div>
                            <v-spacer />
                            <div class="button-group">
                                <v-btn
                                    color="primary"
                                    class="mt-2"
                                    @click="openCreateDialog"
                                >
                                    <v-icon left>
                                        mdi-plus
                                    </v-icon>
                                    新增方案
                                </v-btn>
                                <v-btn
                                    color="secondary"
                                    class="ml-2 mt-2"
                                    :loading="loading"
                                    @click="fetchPlans()"
                                >
                                    <v-icon left>
                                        mdi-refresh
                                    </v-icon>
                                    刷新列表
                                </v-btn>
                            </div>
                        </v-row>
                    </v-card-text>
                </v-card>
                <v-card>
                    <v-card-title>方案列表</v-card-title>
                    <v-card-text>
                        <v-data-table
                            :headers="headers"
                            :items="plans"
                            :items-per-page="pagination.perPage"
                            :page="pagination.currentPage"
                            :server-items-length="pagination.totalItems"
                            :loading="loading"
                            hover
                            @update:options="handleTableUpdate"
                        >
                            <template #item.enabled="{item}">
                                <v-switch
                                    v-model="item.enabled"
                                    color="primary"
                                    hide-details
                                    :loading="item._enabling"
                                    :disabled="item._enabling"
                                    @change="toggleEnabled(item)"
                                />
                            </template>
                            <template #item.amount="{item}">
                                {{ formatCurrency(item.amount, item.currency) }}
                            </template>
                            <template #item.showAmount="{item}">
                                <span v-if="item.showAmount">{{ formatCurrency(item.showAmount, item.currency) }}</span>
                                <span v-else>-</span>
                            </template>
                            <template #item.discount="{item}">
                                <span v-if="item.discount">{{ item.discount }}</span>
                                <span v-else>-</span>
                            </template>
                            <template #item.createdAt="{item}">
                                {{ formatDate(item.createdAt) }}
                            </template>
                            <template #item.updatedAt="{item}">
                                {{ formatDate(item.updatedAt) }}
                            </template>
                            <template #item.actions="{item}">
                                <v-tooltip text="编辑" location="top">
                                    <template #activator="{props}">
                                        <v-btn
                                            icon="mdi-pencil"
                                            size="small"
                                            variant="text"
                                            v-bind="props"
                                            @click="openEditDialog(item)"
                                        />
                                    </template>
                                </v-tooltip>
                                <v-tooltip text="删除" location="top">
                                    <template #activator="{props}">
                                        <v-btn
                                            icon="mdi-delete"
                                            size="small"
                                            variant="text"
                                            color="error"
                                            v-bind="props"
                                            @click="handleDelete(item)"
                                        />
                                    </template>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <!-- 新增/编辑弹窗 -->
        <v-dialog v-model="planDialog" max-width="600px">
            <v-card>
                <v-card-title>
                    {{ editingPlan ? '编辑方案' : '新增方案' }}
                    <v-spacer />
                </v-card-title>
                <v-card-text>
                    <v-form ref="planFormRef" @submit.prevent="handleSubmit">
                        <v-text-field
                            v-model="planForm.title"
                            label="标题"
                            required
                        />
                        <v-select
                            v-model="planForm.paymentChannel"
                            :items="paymentChannels"
                            label="支付渠道"
                            required
                        />
                        <v-text-field
                            v-model="planForm.channelPlanId"
                            label="渠道方案ID"
                            required
                        />
                        <v-select
                            v-model="planForm.currency"
                            :items="currencies"
                            label="币种"
                            required
                        />
                        <v-text-field
                            v-model.number="planForm.amount"
                            label="金额"
                            type="number"
                            required
                        />
                        <v-select
                            v-model="planForm.productType"
                            :items="productTypeOptions"
                            label="类型"
                            required
                        />
                        <v-text-field
                            v-model.number="planForm.month"
                            label="月数"
                            type="number"
                            :rules="[v => planForm.productType === 0 ? (!!v && v > 0) || '必填' : true]"
                            :disabled="planForm.productType !== 0"
                        />
                        <v-text-field
                            v-model.number="planForm.showAmount"
                            label="展示金额"
                            type="number"
                        />
                        <v-text-field
                            v-model.number="planForm.discount"
                            label="折扣"
                            type="number"
                        />
                        <v-textarea v-model="planForm.description" label="描述" />
                        <v-switch v-model="planForm.enabled" label="启用" />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="planDialog = false">
                        取消
                    </v-btn>
                    <v-btn
                        color="primary"
                        :loading="submitLoading"
                        @click="handleSubmit"
                    >
                        {{ editingPlan ? '保存' : '创建' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user'
import { formatDate, formatCurrency } from '@/utils/format'
import type { Pagination } from '@/types/pagination'
import type { Plan } from '@/types/plan'

const toast = useToast()
const userStore = useUserStore()
const loading = ref(false)

const plans = ref<Plan[]>([])
const pagination = ref<Pagination>({
    currentPage: 1,
    perPage: 20,
    totalPages: 0,
    totalItems: 0,
})

const planDialog = ref(false)
const planFormRef = ref()
const planForm = reactive<Plan>({
    title: '',
    amount: 0,
    productType: 0,
    month: 0,
    showAmount: 0,
    discount: 0,
    description: '',
    enabled: true,
    currency: 'CNY',
    id: '',
    createdAt: '',
    updatedAt: '',
    _enabling: false,
    paymentChannel: 'afdian',
    channelPlanId: '',
})
const editingPlan = ref<Plan | null>(null)
const submitLoading = ref(false)

const paymentChannels = [
    // { title: '支付宝', value: 'alipay' },
    // { title: '微信支付', value: 'wechatpay' },
    // { title: '银联支付', value: 'unionpay' },
    // { title: 'PayPal', value: 'paypal' },
    { title: '爱发电', value: 'afdian' },
]

const currencies = [
    { title: '人民币', value: 'CNY' },
    // { title: '美元', value: 'USD' },
    // { title: '欧元', value: 'EUR' },
]

const productTypeOptions = [
    { title: '常规方案', value: 0 },
    { title: '售卖方案', value: 1 },
]

const headers = [
    { title: '标题', key: 'title', width: '160px' },
    { title: '支付渠道', key: 'paymentChannel', width: '120px' },
    { title: '渠道方案ID', key: 'channelPlanId', width: '160px' },
    { title: '币种', key: 'currency', width: '80px' },
    { title: '金额', key: 'amount', width: '100px' },
    { title: '类型', key: 'productType', width: '100px' },
    { title: '月数', key: 'month', width: '80px' },
    { title: '展示金额', key: 'showAmount', width: '100px' },
    { title: '折扣', key: 'discount', width: '80px' },
    { title: '描述', key: 'description', width: '200px' },
    { title: '启用', key: 'enabled', width: '80px' },
    { title: '创建时间', key: 'createdAt', width: '160px' },
    { title: '更新时间', key: 'updatedAt', width: '160px' },
    { title: '操作', key: 'actions', width: '100px', sortable: false },
]

const fetchPlans = async (params: Record<string, any> = {}) => {
    loading.value = true
    try {
        const { data } = await useFetch('/api/admin/plans', {
            query: {
                page: pagination.value.currentPage,
                perPage: pagination.value.perPage,
                ...params,
            },
        }) as any
        if (data.value?.statusCode === 200) {
            plans.value = data.value.data?.items
            pagination.value = data.value.data?.pagination
            return
        }
        throw new Error(data.value?.message || '获取方案列表失败')
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error.message || '获取方案列表失败',
            life: 5000,
        })
    } finally {
        loading.value = false
    }
}

const handleTableUpdate = (options: any) => {
    pagination.value.currentPage = options.page
    pagination.value.perPage = options.itemsPerPage
    fetchPlans({
        sort: options.sortBy?.[0]?.key,
        order: options.sortBy?.[0]?.order?.toUpperCase(),
    })
}

const openCreateDialog = () => {
    editingPlan.value = null
    Object.assign(planForm, {
        title: '',
        amount: 0,
        productType: 0,
        month: 0,
        showAmount: 0,
        discount: 0,
        description: '',
        enabled: true,
        currency: 'CNY',
        id: '',
        createdAt: '',
        updatedAt: '',
        channelPlanId: '',
        paymentChannel: 'afdian',
    })
    planDialog.value = true
}

const openEditDialog = (plan: Plan) => {
    editingPlan.value = plan
    Object.assign(planForm, {
        title: plan.title,
        amount: plan.amount,
        productType: plan.productType,
        month: plan.month,
        showAmount: plan.showAmount ?? 0,
        discount: plan.discount ?? 0,
        description: plan.description ?? '',
        enabled: plan.enabled,
        currency: plan.currency,
        id: plan.id,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
    })
    planDialog.value = true
}

const handleSubmit = async () => {
    if (submitLoading.value) {
        return
    }
    submitLoading.value = true
    try {
        const payload: Record<string, any> = { ...planForm }
        if (payload.amount !== null) {
            payload.amount = Number(payload.amount)
        }
        if (payload.showAmount !== null && payload.showAmount !== undefined) {
            payload.showAmount = Number(payload.showAmount)
        }
        if (payload.discount !== null && payload.discount !== undefined) {
            payload.discount = Number(payload.discount)
        }
        if (payload.month !== null && payload.month !== undefined) {
            payload.month = Number(payload.month)
        }
        if (payload.currency) {
            payload.currency = payload.currency.toUpperCase()
        } else {
            payload.currency = 'CNY'
        }
        let respData
        if (editingPlan.value && editingPlan.value.id) {
            const { data } = await useFetch(`/api/admin/plans/${editingPlan.value.id}`, {
                method: 'PUT',
                body: payload,
            }) as any
            respData = data.value
        } else {
            const { data } = await useFetch('/api/admin/plans/create', {
                method: 'POST',
                body: payload,
            }) as any
            respData = data.value
        }
        if (respData?.statusCode === 200) {
            toast.add({
                severity: 'success',
                summary: '成功',
                detail: editingPlan.value ? '方案已更新' : '方案已创建',
                life: 3000,
            })
            planDialog.value = false
            await fetchPlans()
            return
        }
        throw new Error(respData?.message || '操作失败')

    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error.message || '操作失败',
            life: 5000,
        })
    } finally {
        submitLoading.value = false
    }
}

const handleDelete = async (plan: Plan) => {
    if (!confirm(`确定要删除方案「${plan.title}」吗？`)) {
        return
    }
    try {
        const { data } = await useFetch(`/api/admin/plans/${plan.id}`, { method: 'DELETE' }) as any
        const respData = data.value
        if (respData?.statusCode === 200) {
            toast.add({
                severity: 'success',
                summary: '删除成功',
                detail: '方案已删除',
                life: 3000,
            })
            await fetchPlans()
            return
        }
        throw new Error(respData?.message || '删除失败')
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error.message || '删除失败',
            life: 5000,
        })
    }
}

const toggleEnabled = async (plan: Plan) => {
    plan._enabling = true
    try {
        const { data } = await useFetch(`/api/admin/plans/${plan.id}`, {
            method: 'PUT',
            body: { enabled: plan.enabled },
        }) as any
        const respData = data.value
        if (respData?.statusCode !== 200) {
            throw new Error(respData?.message || '操作失败')
        }
        toast.add({
            severity: 'success',
            summary: '操作成功',
            detail: `方案已${plan.enabled ? '启用' : '禁用'}`,
            life: 3000,
        })
    } catch (error: any) {
        plan.enabled = !plan.enabled // revert
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error.message || '操作失败',
            life: 5000,
        })
    } finally {
        plan._enabling = false
    }
}

onMounted(() => {
    fetchPlans()
})
</script>
