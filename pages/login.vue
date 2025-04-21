<template>
    <div class="login-container">
        <v-card
            class="login-card mx-auto my-auto"
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
                    mdi-link-variant
                </v-icon>
                登录
            </v-card-title>

            <v-form @submit.prevent="handleSubmit">
                <v-card-text class="pa-6">
                    <v-text-field
                        v-model="form.username"
                        label="用户名"
                        required
                        outlined
                        prepend-inner-icon="mdi-account"
                        :rules="[v => !!v || '用户名不能为空']"
                        class="mb-4"
                    />

                    <v-text-field
                        v-model="form.password"
                        label="密码"
                        type="password"
                        required
                        outlined
                        prepend-inner-icon="mdi-lock"
                        :rules="[v => !!v || '密码不能为空']"
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
                        class="login-btn text-h6"
                        elevation="2"
                    >
                        <span class="text-white">登录</span>
                    </v-btn>
                </v-card-actions>
                <div class="pb-6 text-center">
                    <v-btn
                        variant="text"
                        color="primary"
                        @click="goToRegister"
                    >
                        没有账号？去注册
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
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const toast = useToast()

const form = reactive({
    username: '',
    password: '',
})
const loading = ref(false)

async function handleSubmit() {
    loading.value = true
    try {
        const { data } = await useFetch('/api/auth/login', {
            method: 'POST',
            body: form,
        })

        if (data.value?.statusCode === 200) {
            toast.add({
                severity: 'success',
                summary: '成功',
                detail: '登录成功',
                life: 3000,
            })
            await userStore.fetchUserInfo()
            navigateTo('/')
            return
        }
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: data.value?.message || '登录失败',
            life: 5000,
        })
    } catch (error: any) {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error.message || '登录失败',
            life: 5000,
        })
    } finally {
        loading.value = false
    }
}

function goToRegister() {
    navigateTo('/register')
}
</script>

<style lang="scss" scoped>
.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1976D2  0%, #764ba2 100%);
    padding: 20px;
}

.login-card {
    border-radius: 16px !important;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95) !important;
}

.login-btn {
    letter-spacing: 2px;
    text-transform: none;
    border-radius: 8px;
    height: 52px !important;
}

.v-text-field {
    border-radius: 8px;
}
</style>
