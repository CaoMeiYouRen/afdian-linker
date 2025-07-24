<template>
    <div class="oauth-callback-page">
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
                    正在处理 OAuth 登录...
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

async function handleOAuthCallback() {
    try {
        const route = useRoute()
        const { status: urlStatus, message: urlMessage } = route.query

        if (urlStatus === 'success') {
            status.value = 'success'
            message.value = 'OAuth 登录成功，正在跳转...'

            // 获取用户信息
            await userStore.fetchUserInfo()

            useTimeoutFn(() => {
                if (userStore.userInfo?.initialPassword) {
                    toast.add({
                        severity: 'warn',
                        summary: '警告',
                        detail: '为了您的账户安全，请设置登录密码',
                        life: 5000,
                    })
                    navigateTo('/change-password')
                } else {
                    navigateTo('/')
                }
            }, 1500)
            return
        }

        // 处理失败情况
        status.value = 'fail'
        message.value = (urlMessage as string) || 'OAuth 登录失败，正在跳转到登录页...'
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: message.value,
            life: 5000,
        })

        useTimeoutFn(() => {
            navigateTo('/login')
        }, 2000)

    } catch (err: any) {
        status.value = 'fail'
        message.value = err?.message || 'OAuth 登录失败，正在跳转到登录页...'
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

onMounted(handleOAuthCallback)
</script>

<style lang="scss" scoped>
.oauth-callback-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
