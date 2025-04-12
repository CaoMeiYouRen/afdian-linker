<template>
    <v-container>
        <v-row justify="center" align="center">
            <v-col
                cols="12"
                sm="8"
                md="6"
                class="text-center"
            >
                <h1 class="mb-4 text-h4">
                    欢迎使用爱发电助手
                </h1>
                <div v-if="userStore.isLoggedIn" class="mb-4">
                    欢迎回来，{{ userStore.userInfo?.nickname || '用户' }}！
                    <div v-if="userStore.userInfo?.role === 'ADMIN'" class="mt-4">
                        <p>
                            你是管理员，可以访问管理页面。
                        </p>

                        <v-btn color="primary" @click="handleAdminPage">
                            前往管理页面
                        </v-btn>
                    </div>
                    <div class="mt-4">
                        <p>
                            访问赞助页面。
                        </p>
                        <v-btn color="primary" @click="handleCheckoutPage">
                            前往赞助页面
                        </v-btn>
                    </div>
                    <div class="mt-4">
                        <v-btn color="error" @click="handleLogout">
                            退出登录
                        </v-btn>
                    </div>
                </div>
                <div v-else>
                    <p class="mb-4">
                        请先登录以使用完整功能
                    </p>
                    <v-btn color="primary" @click="handleLogin">
                        登录
                    </v-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const toast = useToast()

const handleLogin = () => {
    navigateTo('/login')
}
const handleAdminPage = () => {
    navigateTo('/admin')
}

const handleCheckoutPage = () => {
    navigateTo('/checkout')
}

const handleLogout = async () => {
    await useFetch('/api/auth/logout', { method: 'POST' })
    userStore.clearUserInfo()
    toast.add({
        severity: 'success',
        summary: '成功',
        detail: '登出成功',
        life: 3000,
    })
}

onMounted(async () => {
    await userStore.verifyLogin()
})
</script>
