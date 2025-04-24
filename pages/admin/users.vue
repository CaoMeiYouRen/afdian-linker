<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card class="mb-4">
                    <v-card-title>用户管理</v-card-title>
                    <v-card-text>
                        <v-data-table
                            :headers="headers"
                            :items="users"
                            :items-per-page="pagination.perPage"
                            :page="pagination.currentPage"
                            :server-items-length="pagination.totalItems"
                            :loading="loading"
                            hover
                            @update:options="handleTableUpdate"
                        >
                            <template #item.role="{item}">
                                <v-chip
                                    :color="item.role === UserRole.ADMIN ? 'error' : 'primary'"
                                    text-color="white"
                                >
                                    {{ item.role === UserRole.ADMIN ? '管理员' : '普通用户' }}
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
                                    icon="mdi-refresh"
                                    size="small"
                                    variant="text"
                                    :loading="item.id === resettingId"
                                    @click="handleResetPassword(item)"
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
import { formatDate } from '@/utils/format'
import { UserRole, type User } from '@/types/user'
import type { Pagination } from '@/types/pagination'

const toast = useToast()
const loading = ref(false)
const users = ref<User[]>([])
const resettingId = ref('')
const pagination = ref<Pagination>({
    currentPage: 1,
    perPage: 20,
    totalPages: 0,
    totalItems: 0,
})

const headers = [
    { title: 'ID', key: 'id', width: '200px' },
    { title: 'Auth0 Id', key: 'auth0Id', width: '200px' },
    { title: '用户名', key: 'username', width: '150px' },
    { title: '昵称', key: 'nickname', width: '150px' },
    { title: '邮箱', key: 'email', width: '200px' },
    { title: '角色', key: 'role', width: '120px' },
    { title: '是否是初始密码', key: 'initialPassword', width: '150px' },
    // { title: '是否是初始邮箱', key: 'initialEmail', width: '150px' },
    { title: '是否已验证邮箱', key: 'emailVerified', width: '150px' },
    { title: '注册时间', key: 'createdAt', width: '180px' },
    { title: '更新时间', key: 'updatedAt', width: '180px' },
    { title: '操作', key: 'actions', width: '100px', sortable: false },
]

// 获取用户列表
const fetchUsers = async (params = {}) => {
    loading.value = true
    try {
        const { data, error } = await useFetch('/api/admin/users', {
            query: {
                page: pagination.value.currentPage,
                perPage: pagination.value.perPage,
                ...params,
            },
        })

        if (data.value?.statusCode === 200) {
            users.value = data.value.data.items
            pagination.value = data.value.data.pagination
            return
        }
        throw new Error(error.value?.data?.message || error.value?.message || '获取用户列表失败')
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error.message || '获取用户列表失败',
            life: 5000,
        })
    } finally {
        loading.value = false
    }
}

const handleTableUpdate = (options: any) => {
    pagination.value.currentPage = options.page
    pagination.value.perPage = options.itemsPerPage
    fetchUsers({
        sort: options.sortBy[0]?.key,
        order: options.sortBy[0]?.order?.toUpperCase(),
    })
}

// 重置用户密码
const handleResetPassword = async (user: User) => {

}

onMounted(() => {
    fetchUsers()
})
</script>
