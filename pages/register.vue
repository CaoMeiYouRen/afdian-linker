<template>
    <div class="register-container">
        <v-card
            class="mx-auto my-auto register-card"
            max-width="800"
            min-width="500"
            elevation="8"
        >
            <v-card-title class="font-weight-bold pa-6 text-center text-h4">
                <v-icon
                    size="36"
                    color="primary"
                    class="mr-2"
                >
                    mdi-account-plus
                </v-icon>
                注册
            </v-card-title>
            <v-form @submit.prevent="handleSubmit">
                <v-card-text class="pa-6">
                    <v-tooltip text="用户名注册后不可修改" location="top">
                        <template #activator="{props}">
                            <v-text-field
                                v-model="form.username"
                                label="用户名"
                                required
                                outlined
                                prepend-inner-icon="mdi-account"
                                :rules="[v => !!v || '用户名不能为空']"
                                class="mb-4"
                                v-bind="props"
                            />
                        </template>
                    </v-tooltip>
                    <v-tooltip text="昵称可随时修改" location="top">
                        <template #activator="{props}">
                            <v-text-field
                                v-model="form.nickname"
                                label="昵称"
                                required
                                outlined
                                prepend-inner-icon="mdi-account-circle"
                                :rules="[v => !!v || '昵称不能为空']"
                                class="mb-4"
                                v-bind="props"
                            />
                        </template>
                    </v-tooltip>
                    <v-text-field
                        v-model="form.email"
                        label="邮箱"
                        required
                        outlined
                        prepend-inner-icon="mdi-email"
                        :rules="[v => !!v || '邮箱不能为空', v => /.+@.+\..+/.test(v) || '邮箱格式不正确']"
                        class="mb-4"
                    />
                    <v-text-field
                        v-model="form.password"
                        label="密码"
                        type="password"
                        required
                        outlined
                        prepend-inner-icon="mdi-lock"
                        :rules="[v => !!v || '密码不能为空', v => v.length >= 6 || '密码长度至少为6位']"
                        class="mb-4"
                    />
                    <v-text-field
                        v-model="form.confirmPassword"
                        label="确认密码"
                        type="password"
                        required
                        outlined
                        prepend-inner-icon="mdi-lock-check"
                        :rules="[v => !!v || '请确认密码', v => v === form.password || '两次输入的密码不一致']"
                    />
                </v-card-text>
                <v-card-actions class="pb-8 px-6">
                    <v-btn
                        type="submit"
                        color="primary"
                        variant="elevated"
                        block
                        large
                        :loading="loading"
                        class="register-btn text-h6"
                        elevation="2"
                    >
                        <span class="text-white">注册</span>
                    </v-btn>
                </v-card-actions>
                <div class="pb-6 text-center">
                    <v-btn
                        variant="text"
                        color="primary"
                        @click="goToLogin"
                    >
                        已有账号？去登录
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

const toast = useToast()
const form = reactive({
    username: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
})
const loading = ref(false)

async function handleSubmit() {
    if (form.password !== form.confirmPassword) {
        toast.add({
            severity: 'warn',
            summary: '警告',
            detail: '两次输入的密码不一致',
            life: 5000,
        })
        return
    }
    loading.value = true
    try {
        const { data, error } = await useFetch('/api/auth/register', {
            method: 'POST',
            body: {
                username: form.username,
                nickname: form.nickname,
                email: form.email,
                password: form.password,
            },
        })
        if (data.value?.statusCode === 200) {
            toast.add({
                severity: 'success',
                summary: '注册成功',
                detail: '注册成功，请查收验证邮件',
                life: 3000,
            })
            navigateTo('/login')
            return
        }
        throw new Error(error.value?.data?.message || error.value?.message || '注册失败')
    } catch (error: any) {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error.message || '注册失败',
            life: 5000,
        })
    } finally {
        loading.value = false
    }
}

function goToLogin() {
    navigateTo('/login')
}
</script>

<style lang="scss" scoped>
.register-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1976D2  0%, #764ba2 100%);
    padding: 20px;
}
.register-card {
    border-radius: 16px !important;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95) !important;
}
.register-btn {
    letter-spacing: 2px;
    text-transform: none;
    border-radius: 8px;
    height: 52px !important;
}
.v-text-field {
    border-radius: 8px;
}
</style>
