<template>
    <div class="verify-success-page">
        <v-container class="py-16 text-center">
            <v-progress-circular
                v-if="loading"
                color="primary"
                :size="64"
                :width="7"
                indeterminate
                class="mb-6"
            />
            <v-icon
                v-else
                :color="status === 'success' ? 'success' : 'error'"
                size="64"
            >
                {{ status === 'success' ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
            <template v-if="loading">
                <h2 class="mb-2 mt-4">
                    正在处理第三方登录...
                </h2>
                <p>
                    请稍等片刻...
                </p>
            </template>
            <template v-else>
                <h2 class="mb-2 mt-4">
                    {{ status === 'success' ? '登录成功' : '登录失败' }}
                </h2>
                <p>
                    {{ message || (status === 'success' ? '正在跳转...' : '登录失败，正在跳转到登录页...') }}
                </p>
            </template>
        </v-container>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth0, type Auth0VueClient } from '@auth0/auth0-vue'
import { useToast } from 'primevue/usetoast'
import { useTimeoutFn } from '@vueuse/core'
import { useUserStore } from '@/stores/user'

definePageMeta({
    layout: 'blank',
})

const loading = ref(true)
const status = ref<'success' | 'fail'>('fail')
const message = ref('')
const toast = useToast()
const userStore = useUserStore()

const auth0 = ref<Auth0VueClient>(null as any)
// 只在客户端初始化 Auth0
if (import.meta.client) {
    try {
        auth0.value = useAuth0()
    } catch (error) {
        console.warn('Auth0 not available:', error)
    }
}

async function handleAuth0Callback() {
    try {
        if (!auth0.value) {
            throw new Error('Auth0 未初始化，请刷新页面重试')
        }
        // 处理 Auth0 回调
        await auth0.value.getAccessTokenSilently()
        const token = auth0.value?.idTokenClaims?.__raw
        if (!token) {
            throw new Error('未获取到有效的 id_token')
        }
        // 调用后端同步用户
        const { data, error } = await useFetch('/api/auth/auth0-login', {
            method: 'POST',
            body: { token },
        })
        if (data.value?.statusCode === 200) {
            status.value = 'success'
            message.value = '第三方登录成功，正在跳转...'
            await userStore.fetchUserInfo()
            useTimeoutFn(() => {
                if (userStore.userInfo?.initialPassword) {
                    toast.add({
                        severity: 'warn',
                        summary: '警告',
                        detail: '为了您的账户安全，请修改初始密码',
                        life: 5000,
                    })
                    navigateTo('/change-password')
                } else {
                    navigateTo('/')
                }
            }, 1500)
            return
        }
        throw new Error(error.value?.data?.message || error.value?.message || '第三方登录失败')
    } catch (err: any) {
        status.value = 'fail'
        message.value = err?.message || '第三方登录失败，正在跳转到登录页...'
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: message.value,
            life: 5000,
        })
        useTimeoutFn(() => {
            navigateTo('/login')
        }, 2000)
    } finally {
        loading.value = false
    }
}

onMounted(handleAuth0Callback)
</script>

<style lang="scss" scoped>
.verify-success-page {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
