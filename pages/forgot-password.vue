<template>
    <div class="forgot-container">
        <v-card
            class="forgot-card mx-auto my-auto"
            elevation="8"
        >
            <v-card-title class="font-weight-bold pa-6 text-center text-h5">
                <v-icon
                    size="32"
                    color="primary"
                    class="mr-2"
                >
                    mdi-lock-reset
                </v-icon>
                找回密码
            </v-card-title>
            <v-form @submit.prevent="handleSubmit">
                <v-card-text class="pa-6">
                    <v-text-field
                        v-model="email"
                        label="邮箱"
                        required
                        outlined
                        prepend-inner-icon="mdi-email"
                        :rules="[v => !!v || '请输入邮箱']"
                        class="mb-4"
                    />
                </v-card-text>
                <v-card-actions class="pb-6 px-6">
                    <v-btn
                        type="submit"
                        color="primary"
                        block
                        :loading="loading"
                        class="forgot-btn text-h6"
                        elevation="2"
                        variant="elevated"
                    >
                        发送重置邮件
                    </v-btn>
                </v-card-actions>
                <div class="pb-6 text-center">
                    <v-btn
                        variant="text"
                        color="primary"
                        @click="goToLogin"
                    >
                        返回登录
                    </v-btn>
                </div>
            </v-form>
        </v-card>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'blank',
})

import { useToast } from 'primevue/usetoast'
const email = ref('')
const loading = ref(false)
const toast = useToast()
function goToLogin() {
    navigateTo('/login')
}
async function handleSubmit() {
    loading.value = true
    try {
        if (!email.value) {
            toast.add({
                severity: 'error',
                summary: '错误',
                detail: '请输入邮箱',
                life: 5000,
            })
            return
        }
        const { data, error } = await useFetch('/api/auth/forgot-password', {
            method: 'POST',
            body: { email: email.value },
        })
        if (data.value?.statusCode === 200) {
            toast.add({
                severity: 'success',
                summary: '提示',
                detail: data.value?.message || '如果该邮箱已注册且已验证，将收到重置密码邮件',
                life: 5000,
            })
            return
        }
        throw new Error(error.value?.data?.message || error.value?.message || '发送重置邮件失败')
    } catch (error: any) {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error.message || '发送重置邮件失败',
            life: 5000,
        })
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped>
.forgot-container {
    min-height: 100vh;
    width: 100vw; // 保证宽度不超出视口
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1976D2  0%, #764ba2 100%);
    padding: 20px;
    overflow-x: hidden; // 防止横向滚动
}

.forgot-card {
    border-radius: 16px !important;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95) !important;
    width: 100%;
    max-width: 500px;
    min-width: 320px;
    box-sizing: border-box;
}

.forgot-btn {
    letter-spacing: 2px;
    text-transform: none;
    border-radius: 8px;
    height: 52px !important;
}

.v-text-field {
    border-radius: 8px;
}

/* 响应式适配手机端 */
@media (max-width: 600px) {
    .forgot-container {
        padding: 8px;
        width: 100vw;
        overflow-x: hidden;
    }
    .forgot-card {
        max-width: 100vw;
        min-width: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
    }
    .v-card-title,
    .v-card-text,
    .v-card-actions {
        padding-left: 12px !important;
        padding-right: 12px !important;
        padding-top: 12px !important;
        padding-bottom: 12px !important;
    }
    .forgot-btn {
        height: 44px !important;
        font-size: 16px !important;
    }
    .v-text-field {
        font-size: 16px !important;
    }
    .pb-6, .pa-6, .px-6 {
        padding-bottom: 12px !important;
        padding-top: 12px !important;
        padding-left: 12px !important;
        padding-right: 12px !important;
    }
}
</style>
