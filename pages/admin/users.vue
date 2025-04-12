<!-- eslint-disable vue/valid-v-slot -->
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
                            :loading="loading"
                            hover
                        >
                            <template #item.role="{item}">
                                <v-chip
                                    :color="item.role === 'ADMIN' ? 'error' : 'primary'"
                                    text-color="white"
                                >
                                    {{ item.role === 'ADMIN' ? '管理员' : '普通用户' }}
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
import type { User } from '@/types/user'

const toast = useToast()
const loading = ref(false)
const users = ref<User[]>([])
const resettingId = ref('')

const headers = [
    { title: 'ID', key: 'id', width: '200px' },
    { title: '用户名', key: 'username', width: '150px' },
    { title: '昵称', key: 'nickname', width: '150px' },
    { title: '邮箱', key: 'email', width: '200px' },
    { title: '角色', key: 'role', width: '120px' },
    { title: '注册时间', key: 'createdAt', width: '180px' },
    { title: '更新时间', key: 'updatedAt', width: '180px' },
    { title: '操作', key: 'actions', width: '100px', sortable: false },
]

// 获取用户列表
const fetchUsers = async () => {
    loading.value = true
    try {
        const { data } = await useFetch('/api/admin/users')
        if (data.value?.statusCode === 200) {
            users.value = data.value.data?.users || [] as any[]
        }
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

// 重置用户密码
const handleResetPassword = async (user: User) => {

}

onMounted(() => {
    fetchUsers()
})
</script>
