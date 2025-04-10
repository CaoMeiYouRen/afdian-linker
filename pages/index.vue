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
                <div v-if="isLoggedIn" class="mb-4">
                    欢迎回来，{{ nickname }}！
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
import { ref, onMounted } from 'vue'
import { useCookie } from '#app'

const isLoggedIn = ref(false)
const nickname = ref('')

const handleLogin = () => {
    // TODO: 实现登录逻辑，需要跳转到登录页面
    navigateTo('/login')
}

const handleLogout = async () => {
    const { data } = await useFetch('/api/auth/logout', { method: 'POST' })
    isLoggedIn.value = false
    nickname.value = ''
}

onMounted(async () => {
    try {
        const response = await $fetch('/api/auth/verify')
        if (response?.success) {
            isLoggedIn.value = true
            nickname.value = response.data.nickname || '用户'
        }
    } catch (error) {
        console.error('验证登录状态失败:', error)
    }
})
</script>
