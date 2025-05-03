<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card class="mb-4">
                    <v-card-title>验证码管理</v-card-title>
                    <v-card-text>
                        <v-row align="center">
                            <v-spacer />
                            <div class="button-group mb-2">
                                <v-btn
                                    color="error"
                                    class="mr-2"
                                    :loading="cleanupLoading"
                                    @click="handleCleanup"
                                >
                                    <v-icon left>
                                        mdi-broom
                                    </v-icon>
                                    清理无效验证码
                                </v-btn>
                            </div>
                        </v-row>
                    </v-card-text>
                </v-card>
                <v-card class="mb-4">
                    <v-card-title>验证码列表</v-card-title>
                    <v-card-text>
                        <v-data-table
                            :headers="headers"
                            :items="codes"
                            :items-per-page="pagination.perPage"
                            :page="pagination.currentPage"
                            :server-items-length="pagination.totalItems"
                            :loading="loading"
                            @update:options="handleTableUpdate"
                        >
                            <template #item.id="{item}">
                                <v-tooltip :text="item.id">
                                    <template #activator="{props}">
                                        <span v-bind="props">{{ shortText(item.id) }}</span>
                                    </template>
                                </v-tooltip>
                            </template>
                            <template #item.type="{item}">
                                <v-chip :color="item.type === 'email_verify' ? 'blue' : 'green'" small>
                                    {{ formatCodeType(item.type) }}
                                </v-chip>
                            </template>
                            <template #item.code="{item}">
                                <v-tooltip :text="item.code">
                                    <template #activator="{props}">
                                        <v-chip small v-bind="props">
                                            {{ shortText(item.code) }}
                                        </v-chip>
                                    </template>
                                </v-tooltip>
                            </template>
                            <template #item.user="{item}">
                                <v-chip small>
                                    {{ item.user.nickname || item.user.email || shortText(item.user.id) }}
                                </v-chip>
                            </template>
                            <template #item.used="{item}">
                                <v-chip :color="item.used ? 'success' : 'warning'" small>
                                    {{ item.used ? '已用' : '未用' }}
                                </v-chip>
                            </template>
                            <template #item.expiresAt="{item}">
                                {{ formatDate(item.expiresAt) }}
                            </template>
                            <template #item.createdAt="{item}">
                                {{ formatDate(item.createdAt) }}
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { formatDate } from '@/utils/format'
import { shortText } from '@/utils/short-text'

definePageMeta({
})

const toast = useToast()
const loading = ref(false)
const codes = ref<any[]>([])
const pagination = ref({
    currentPage: 1,
    perPage: 20,
    totalPages: 0,
    totalItems: 0,
})

const headers = [
    { title: 'ID', key: 'id', width: '80px' },
    { title: '类型', key: 'type', width: '120px' },
    { title: '验证码', key: 'code', width: '150px' },
    { title: '用户', key: 'user', width: '160px' },
    { title: '是否已用', key: 'used', width: '100px' },
    { title: '过期时间', key: 'expiresAt', width: '180px' },
    { title: '创建时间', key: 'createdAt', width: '180px' },
]

const formatCodeType = (type: string) => {
    switch (type) {
        case 'email_verify':
            return '邮箱验证'
        case 'reset_password':
            return '重置密码'
        default:
            return '未知类型'
    }
}

// 获取验证码列表
const fetchCodes = async (params = {}) => {
    loading.value = true
    try {
        const { data, error } = await useFetch('/api/admin/verification-codes', {
            query: {
                page: pagination.value.currentPage,
                perPage: pagination.value.perPage,
                ...params,
            },
        })

        if (data.value?.statusCode === 200) {
            codes.value = data.value.data.items
            pagination.value = data.value.data.pagination
            return
        }
        throw new Error(error.value?.data?.message || error.value?.message || '获取失败')
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error.message || '获取失败',
            life: 5000,
        })
    } finally {
        loading.value = false
    }
}

const handleTableUpdate = (options: any) => {
    pagination.value.currentPage = options.page
    pagination.value.perPage = options.itemsPerPage
    fetchCodes({
        sort: options.sortBy?.[0]?.key,
        order: options.sortBy?.[0]?.order?.toUpperCase(),
    })
}

const cleanupLoading = ref(false)

const handleCleanup = async () => {
    cleanupLoading.value = true
    try {
        const { data, error } = await useFetch('/api/admin/verification-codes/cleanup', { method: 'POST' })
        if (data.value?.statusCode === 200) {
            toast.add({
                severity: 'success',
                summary: '清理完成',
                detail: `已清理 ${data.value.data?.count || 0} 条无效验证码`,
                life: 3000,
            })
            await fetchCodes()
            return
        }
        throw new Error(error.value?.data?.message || error.value?.message || '清理失败')
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: '清理失败',
            detail: error.message || '清理失败',
            life: 5000,
        })
    } finally {
        cleanupLoading.value = false
    }
}

onMounted(() => {
    fetchCodes()
})
</script>

<style scoped>
.verification-codes-page {
    min-height: 80vh;
    padding: 24px;
}
</style>
