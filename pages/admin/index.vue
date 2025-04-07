<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card class="mb-4">
                    <v-card-title>管理后台</v-card-title>
                    <v-card-text>
                        <p>欢迎使用爱发电订单管理系统</p>
                    </v-card-text>
                </v-card>
                <v-card>
                    <v-card-title>最近订单</v-card-title>
                    <v-card-text>
                        <v-data-table
                            :headers="headers"
                            :items="orders"
                            :loading="loading"
                        />
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

const loading = ref(false)
const orders = ref([])
const headers = [
    { title: '订单号', key: 'id' },
    { title: '金额', key: 'amount' },
    { title: '状态', key: 'status' },
    { title: '创建时间', key: 'created_at' },
]

// TODO: 获取订单列表
</script>
