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

                <v-card-actions class="pb-4 px-6">
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
                <v-card-actions class="pb-4 px-6">
                    <v-btn
                        v-if="enableAuth0"
                        color="success"
                        variant="elevated"
                        class="login-btn"
                        block
                        :loading="auth0Loading"
                        @click="handleAuth0Login"
                    >
                        <v-icon left>
                            mdi-lock-open-variant
                        </v-icon>
                        使用 Auth0 一键登录/注册
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
                    <v-btn
                        variant="text"
                        color="secondary"
                        class="ml-2"
                        @click="goToForgot"
                    >
                        忘记密码？
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
import { reactive, ref } from 'vue'
import { useAuth0, type Auth0VueClient } from '@auth0/auth0-vue'
import { useUserStore } from '@/stores/user'
import { enableAuth0 } from '@/plugins/auth0.client'

const userStore = useUserStore()
const toast = useToast()

const form = reactive({
    username: '',
    password: '',
})
const loading = ref(false)
const auth0Loading = ref(false)
const auth0 = ref<Auth0VueClient>(null as any)
auth0.value = useAuth0()
async function handleAuth0Login() {
    auth0Loading.value = true
    try {

        if (!auth0.value) {
            throw new Error('Auth0 未初始化，请刷新页面重试')
        }
        const { loginWithRedirect, isAuthenticated } = auth0.value

        if (isAuthenticated) {
            // 已登录，直接跳转到回调页面
            navigateTo('/auth0-callback')
            return
        }
        // 跳转到 Auth0 登录，回调到 /auth0-callback
        await loginWithRedirect({
            authorizationParams: {
                // connection: 'github',
                redirect_uri: `${window.location.origin}/auth0-callback`,
            },
        })
    } catch (error: any) {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error?.message || '第三方登录失败',
            life: 5000,
        })
    } finally {
        auth0Loading.value = false
    }
}

async function handleSubmit() {
    loading.value = true
    try {
        const { data, error } = await useFetch('/api/auth/login', {
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
            if (userStore.userInfo?.initialPassword) {
                toast.add({
                    severity: 'warn',
                    summary: '警告',
                    detail: '为了您的账户安全，请修改初始密码',
                    life: 5000,
                })
                navigateTo('/change-password')
                return
            }
            navigateTo('/')
            return
        }
        throw new Error(error.value?.data?.message || error.value?.message || '登录失败')
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

function goToForgot() {
    navigateTo('/forgot-password')
}

</script>

<style lang="scss" scoped>
.login-container {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1976D2 0%, #764ba2 100%);
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
