<template>
    <v-layout class="border rounded rounded-md">
        <!-- 侧边导航栏 -->
        <v-navigation-drawer
            v-model="drawer"
        >
            <v-list>
                <v-list-item
                    to="/"
                    :title="'首页'"
                    prepend-icon="mdi-home"
                />
                <v-list-item
                    to="/checkout"
                    :title="'赞助'"
                    prepend-icon="mdi-cash"
                />
                <template v-if="userStore.isLoggedIn">
                    <v-list-item
                        to="/orders"
                        :title="'我的订单'"
                        prepend-icon="mdi-clipboard-text"
                    />
                    <v-list-item
                        to="/profile"
                        :title="'个人中心'"
                        prepend-icon="mdi-account-circle"
                    />
                </template>
                <!-- 管理员菜单项 -->
                <template v-if="userStore.isAdmin">
                    <v-divider />
                    <v-list-subheader>管理功能</v-list-subheader>
                    <v-list-item
                        to="/admin/orders"
                        :title="'订单管理'"
                        prepend-icon="mdi-clipboard-text"
                    />
                    <v-list-item
                        to="/admin/users"
                        :title="'用户管理'"
                        prepend-icon="mdi-account-group"
                    />
                    <v-list-item
                        to="/admin/webhook-logs"
                        :title="'Webhook日志'"
                        prepend-icon="mdi-webhook"
                    />
                </template>
            </v-list>
        </v-navigation-drawer>
        <!-- 顶部导航栏 -->
        <v-app-bar
            elevation="2"
            color="primary"
            class="px-4"
            density="comfortable"
        >
            <v-app-bar-nav-icon color="white" @click="drawer = !drawer" />
            <v-app-bar-title class="font-weight-medium white--text">
                爱发电助手
            </v-app-bar-title>
            <v-spacer />
            <template v-if="!userStore.isLoggedIn">
                <v-btn
                    text
                    class="mx-2"
                    color="white"
                    to="/login"
                >
                    <v-icon left>
                        mdi-login
                    </v-icon>
                    登录
                </v-btn>
            </template>
        </v-app-bar>
        <!-- 页面主体内容 -->
        <v-main class="align-center d-flex justify-center">
            <slot />
        </v-main>
    </v-layout>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user'

const drawer = ref(false)
const userStore = useUserStore()
const toast = useToast()

const handleLogout = async () => {
  await useFetch('/api/auth/logout', { method: 'POST' })
  userStore.clearUserInfo()
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '登出成功',
    life: 3000,
  })
  navigateTo('/login')
}

const handleChangePassword = () => {
    navigateTo('/change-password')
}

onMounted(async () => {
    await userStore.verifyLogin()
})
</script>

<style scoped>
.v-app-bar {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.v-app-bar-title {
    font-size: 1.25rem;
    letter-spacing: 0.5px;
}

.v-btn {
    text-transform: none;
    font-weight: 500;
}
</style>
