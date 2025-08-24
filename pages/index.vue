<template>
    <v-container>
        <v-row
            justify="center"
            align="center"
            class="min-vh-100"
        >
            <v-col
                cols="12"
                sm="8"
                md="6"
                class="text-center"
            >
                <div class="welcome-section">
                    <h1 class="font-weight-bold mb-6 primary--text text-h3 welcome-title">
                        欢迎使用爱发电助手
                    </h1>
                    <div v-if="userStore.isLoggedIn" class="mb-6">
                        <p class="mb-4 text-h6">
                            欢迎回来，<span class="font-weight-bold primary--text">{{ userStore.userInfo?.nickname || '用户' }}</span>！
                        </p>
                        <v-card
                            v-if="userStore.isAdmin"
                            class="action-card mb-4"
                            elevation="2"
                        >
                            <v-card-text>
                                <p class="mb-4 text-body-1">
                                    你是管理员，可以访问管理页面
                                </p>
                                <v-btn
                                    color="primary"
                                    size="large"
                                    elevation="2"
                                    class="action-button"
                                    @click="handleAdminPage"
                                >
                                    <v-icon left class="mr-2 mt-2">
                                        mdi-shield-account
                                    </v-icon>
                                    前往管理页面
                                </v-btn>
                            </v-card-text>
                        </v-card>
                        <v-card
                            class="action-card"
                            elevation="2"
                        >
                            <v-card-text>
                                <p class="mb-4 text-body-1">
                                    立即支持我们的工作
                                </p>
                                <v-btn
                                    color="primary"
                                    size="large"
                                    elevation="2"
                                    class="action-button"
                                    @click="handleCheckoutPage"
                                >
                                    <v-icon left class="mr-2 mt-2">
                                        mdi-heart
                                    </v-icon>
                                    前往赞助页面
                                </v-btn>
                            </v-card-text>
                        </v-card>
                    </div>
                    <div v-else class="login-section pa-4">
                        <p class="mb-4 text-body-1">
                            请先登录以使用完整功能
                        </p>
                        <v-btn
                            color="primary"
                            size="large"
                            elevation="2"
                            class="action-button"
                            @click="handleLogin"
                        >
                            <v-icon left class="mr-2 mt-2">
                                mdi-login
                            </v-icon>
                            登录
                        </v-btn>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const toast = useToast()

const handleLogin = () => {
    navigateTo('/login')
}
const handleAdminPage = () => {
    navigateTo('/admin/orders')
}

const handleCheckoutPage = () => {
    navigateTo('/checkout')
}

onMounted(async () => {
    // 检查用户是否登录
    //   if (!userStore.isLoggedIn) {
    //     await userStore.fetchUserInfo()
    // }
    // if (!userStore.isLoggedIn) {
    //     return navigateTo('/login')
    // }
})

</script>

<style lang="scss" scoped>
.min-vh-100 {
    // min-height: calc(100vh); // 减去顶部导航栏高度
    // background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
}

.welcome-section {
    animation: fadeInUp 0.6s ease-out;
}

.welcome-title {
    color: #1976D2;
    text-shadow: 2px 2px 4px rgb(0,0,0,0.08);
    position: relative;
    letter-spacing: 1px;

}

.action-card {
    border-radius: 12px;
    backdrop-filter: blur(10px);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background: rgb(255, 255, 255, 0.92);
    border: 1px solid rgb(255, 255, 255, 0.1);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgb(0, 0, 0, 0.15) !important;
    }
}

.action-button {
    min-width: 200px;
    letter-spacing: 1px;
    text-transform: none;
}

@keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
