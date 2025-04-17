<template>
    <v-container>
        <v-row justify="center">
            <v-col
                cols="12"
                sm="8"
                md="6"
            >
                <!-- 加载动画 -->
                <div
                    v-if="!userStore.isLoggedIn"
                    class="align-center d-flex justify-center"
                    style="min-height: 400px;"
                >
                    <v-progress-circular
                        indeterminate
                        color="primary"
                        size="64"
                    />
                </div>
                <!-- 个人信息卡片 -->
                <v-card v-else class="mb-4">
                    <v-card-title class="font-weight-bold text-h5">
                        个人资料
                    </v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-item>
                                <template #prepend>
                                    <v-icon color="primary">
                                        mdi-account
                                    </v-icon>
                                </template>
                                <v-list-item-title>用户名</v-list-item-title>
                                <v-list-item-subtitle>{{ userStore.userInfo?.username }}</v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item>
                                <template #prepend>
                                    <v-icon color="primary">
                                        mdi-card-account-details
                                    </v-icon>
                                </template>
                                <v-list-item-title>昵称</v-list-item-title>
                                <v-list-item-subtitle>{{ userStore.userInfo?.nickname }}</v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item>
                                <template #prepend>
                                    <v-icon color="primary">
                                        mdi-email
                                    </v-icon>
                                </template>
                                <v-list-item-title>邮箱</v-list-item-title>
                                <v-list-item-subtitle>{{ userStore.userInfo?.email }}</v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item>
                                <template #prepend>
                                    <v-icon color="primary">
                                        mdi-shield-account
                                    </v-icon>
                                </template>
                                <v-list-item-title>角色</v-list-item-title>
                                <v-list-item-subtitle>{{ userStore.userInfo?.role === 'ADMIN' ? '管理员' : '普通用户' }}</v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item>
                                <template #prepend>
                                    <v-icon color="primary">
                                        mdi-clock
                                    </v-icon>
                                </template>
                                <v-list-item-title>注册时间</v-list-item-title>
                                <v-list-item-subtitle>{{ formatDate(userStore.userInfo?.createdAt || '') }}</v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                            color="primary"
                            variant="elevated"
                            @click="handleChangePassword"
                        >
                            <v-icon class="ml-2">
                                mdi-key
                            </v-icon>
                            修改密码
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { formatDate } from '@/utils/format'

definePageMeta({
    // middleware: ['auth'],
})

const userStore = useUserStore()

const handleChangePassword = () => {
    navigateTo('/change-password')
}

</script>
