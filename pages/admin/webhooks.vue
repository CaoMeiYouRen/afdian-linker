<!-- eslint-disable vue/valid-v-slot -->
<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card class="mb-4">
                    <v-card-title>Webhook日志</v-card-title>
                    <v-card-text>
                        <v-data-table
                            :headers="headers"
                            :items="logs"
                            :loading="loading"
                            hover
                        >
                            <template #item.createdAt="{item}">
                                {{ formatDate(item.createdAt) }}
                            </template>
                            <template #item.payload="{item}">
                                <v-btn
                                    size="small"
                                    variant="text"
                                    @click="viewPayload(item.payload)"
                                >
                                    查看数据
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>

                <!-- 查看数据弹窗 -->
                <v-dialog v-model="dialog" max-width="800">
                    <v-card>
                        <v-card-title>Webhook数据</v-card-title>
                        <v-card-text>
                            <pre class="payload-preview">{{ JSON.stringify(currentPayload, null, 2) }}</pre>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn
                                color="primary"
                                text
                                @click="dialog = false"
                            >
                                关闭
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
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
import type { WebhookLog } from '@/types/webhook-log'

const toast = useToast()
const loading = ref(false)
const logs = ref<WebhookLog[]>([])
const dialog = ref(false)
const currentPayload = ref(null)

const headers = [
    { title: 'ID', key: 'id', width: '200px' },
    { title: '接收时间', key: 'createdAt', width: '180px' },
    { title: '数据', key: 'payload', width: '120px' },
]

// 获取日志列表
const fetchLogs = async () => {
    loading.value = true
    try {
        const { data } = await useFetch('/api/admin/webhook-logs')
        if (data.value?.statusCode === 200) {
            logs.value = data.value.data?.logs || [] as any[]
        }
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error.message || '获取日志失败',
            life: 5000,
        })
    } finally {
        loading.value = false
    }
}

// 查看payload数据
const viewPayload = (payload: any) => {
    currentPayload.value = payload
    dialog.value = true
}

onMounted(() => {
    fetchLogs()
})
</script>

<style scoped>
.payload-preview {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    max-height: 400px;
    overflow: auto;
}
</style>
