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
                    v-if="loading"
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
                                <v-list-item-subtitle class="align-center d-flex">
                                    {{ userStore.userInfo?.nickname }}
                                    <v-tooltip text="修改昵称" location="top">
                                        <template #activator="{props}">
                                            <v-btn
                                                icon="mdi-pencil"
                                                size="small"
                                                variant="text"
                                                class="ml-2"
                                                v-bind="props"
                                                @click="openNicknameDialog"
                                            />
                                        </template>
                                    </v-tooltip>
                                </v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item>
                                <template #prepend>
                                    <v-icon color="primary">
                                        mdi-email
                                    </v-icon>
                                </template>
                                <v-list-item-title>邮箱</v-list-item-title>
                                <v-list-item-subtitle class="align-center d-flex">
                                    {{ userStore.userInfo?.email }}
                                    <v-chip
                                        v-if="userStore.userInfo?.emailVerified"
                                        color="success"
                                        size="small"
                                        class="ml-2"
                                    >
                                        已验证
                                    </v-chip>
                                    <v-chip
                                        v-else
                                        color="warning"
                                        size="small"
                                        class="ml-2"
                                    >
                                        未验证
                                    </v-chip>
                                    <v-tooltip text="修改邮箱" location="top">
                                        <template #activator="{props}">
                                            <v-btn
                                                icon="mdi-pencil"
                                                size="small"
                                                variant="text"
                                                class="ml-2"
                                                v-bind="props"
                                                @click="openEmailDialog"
                                            />
                                        </template>
                                    </v-tooltip>
                                    <v-tooltip
                                        v-if="!userStore.userInfo?.emailVerified"
                                        text="发送验证邮件"
                                        location="top"
                                    >
                                        <template #activator="{props}">
                                            <v-btn
                                                icon="mdi-email-arrow-right"
                                                size="small"
                                                variant="text"
                                                class="ml-2"
                                                :loading="emailVerifyLoading"
                                                v-bind="props"
                                                @click="handleSendVerifyEmail"
                                            >
                                                <v-icon>mdi-email-arrow-right</v-icon>
                                            </v-btn>
                                        </template>
                                    </v-tooltip>
                                </v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item>
                                <template #prepend>
                                    <v-icon color="primary">
                                        mdi-shield-account
                                    </v-icon>
                                </template>
                                <v-list-item-title>角色</v-list-item-title>
                                <v-list-item-subtitle>{{ userStore.isAdmin ? '管理员' : '普通用户' }}</v-list-item-subtitle>
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
                <!-- 修改昵称对话框 -->
                <v-dialog v-model="showNicknameDialog" max-width="400">
                    <v-card>
                        <v-card-title>修改昵称</v-card-title>
                        <v-card-text>
                            <v-text-field
                                v-model="newNickname"
                                label="新昵称"
                                :rules="[v => !!v || '昵称不能为空']"
                            />
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn variant="text" @click="showNicknameDialog = false">
                                取消
                            </v-btn>
                            <v-btn
                                color="primary"
                                :loading="loading"
                                @click="handleUpdateNickname"
                            >
                                确认
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <!-- 修改邮箱对话框 -->
                <v-dialog v-model="showEmailDialog" max-width="400">
                    <v-card>
                        <v-card-title>修改邮箱</v-card-title>
                        <v-card-text>
                            <v-text-field
                                v-model="newEmail"
                                label="新邮箱"
                                :rules="[v => !!v || '邮箱不能为空', v => /.+@.+\..+/.test(v) || '邮箱格式不正确']"
                            />
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn variant="text" @click="showEmailDialog = false">
                                取消
                            </v-btn>
                            <v-btn
                                color="primary"
                                :loading="emailLoading"
                                @click="handleUpdateEmail"
                            >
                                确认
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user'
import { formatDate } from '@/utils/format'

definePageMeta({
    // middleware: ['auth'],
})

const toast = useToast()
const userStore = useUserStore()

const showNicknameDialog = ref(false)
const newNickname = ref('')
const loading = ref(false)

const showEmailDialog = ref(false)
const newEmail = ref('')
const emailLoading = ref(false)
const emailVerifyLoading = ref(false)

const openNicknameDialog = () => {
    newNickname.value = userStore.userInfo?.nickname || ''
    showNicknameDialog.value = true
}

const openEmailDialog = () => {
    newEmail.value = userStore.userInfo?.email || ''
    showEmailDialog.value = true
}

const handleUpdateNickname = async () => {
    if (!newNickname.value) {
        return
    }
    loading.value = true
    try {
        await useFetch('/api/user/nickname', {
            method: 'POST',
            body: { nickname: newNickname.value },
        })
        await userStore.fetchUserInfo()
        toast.add({
            severity: 'success',
            summary: '成功',
            detail: '修改成功',
            life: 3000,
        })
        showNicknameDialog.value = false
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error?.message || '修改失败',
            life: 5000,
        })
    } finally {
        loading.value = false
    }
}

const handleUpdateEmail = async () => {
    if (!newEmail.value) {
        return
    }
    emailLoading.value = true
    try {
        await useFetch('/api/user/email', {
            method: 'POST',
            body: { email: newEmail.value },
        })
        await userStore.fetchUserInfo()
        toast.add({
            severity: 'success',
            summary: '成功',
            detail: '邮箱修改成功，请查收验证邮件',
            life: 3000,
        })
        showEmailDialog.value = false
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error?.message || '邮箱修改失败',
            life: 5000,
        })
    } finally {
        emailLoading.value = false
    }
}

const handleSendVerifyEmail = async () => {
    emailVerifyLoading.value = true
    try {
        await useFetch('/api/user/email-verify', { method: 'POST' })
        toast.add({
            severity: 'success',
            summary: '成功',
            detail: '验证邮件已发送，请查收',
            life: 3000,
        })
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error?.message || '发送失败',
            life: 5000,
        })
    } finally {
        emailVerifyLoading.value = false
    }
}

const handleChangePassword = () => {
    navigateTo('/change-password')
}

onMounted(async () => {
    // if (!userStore.isLoggedIn) {
    //     navigateTo('/login')
    //     return
    // }
    if (userStore.userInfo) {
        return
    }
    loading.value = true
    userStore.fetchUserInfo()
    .catch((error) => {
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error?.message || '获取用户信息失败',
            life: 5000,
        })
        navigateTo('/login')
    }).finally(() => {
        loading.value = false
    })
})

</script>
