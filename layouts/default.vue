<template>
    <v-layout v-if="userStore.isReady" class="border rounded rounded-md">
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

                <template v-if="userStore.isLoggedIn">
                    <v-list-item
                        to="/checkout"
                        :title="'赞助'"
                        prepend-icon="mdi-cash"
                    />
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
                    <v-divider />
                </template>
                <!-- 管理员菜单项 -->
                <template v-if="userStore.isAdmin">
                    <v-list-subheader>管理功能</v-list-subheader>
                    <v-list-item
                        to="/admin/orders"
                        :title="'订单管理'"
                        prepend-icon="mdi-clipboard-text"
                    />
                    <v-list-item
                        to="/admin/plans"
                        :title="'商品管理'"
                        prepend-icon="mdi-package-variant"
                    />
                    <v-list-item
                        to="/admin/users"
                        :title="'用户管理'"
                        prepend-icon="mdi-account-group"
                    />
                    <v-list-item
                        to="/admin/verification-codes"
                        :title="'验证码列表'"
                        prepend-icon="mdi-lock-check-outline"
                    />
                    <v-list-item
                        to="/admin/webhook-logs"
                        :title="'Webhook日志'"
                        prepend-icon="mdi-webhook"
                    />

                    <v-divider />
                </template>

                <v-list-item
                    to="/about"
                    :title="'关于'"
                    prepend-icon="mdi-information"
                />
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
            <template v-if="userStore.isLoggedIn">
                <v-btn
                    text
                    class="error--text mx-2"
                    color="white"
                    @click="handleLogout"
                >
                    <v-icon left>
                        mdi-logout
                    </v-icon>
                    退出登录
                </v-btn>
            </template>
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
    <!-- 骨架屏 loading -->
    <div v-else style="min-height:100vh;display:flex;align-items:center;justify-content:center;">
        <v-progress-circular
            color="primary"
            :size="128"
            :width="7"
            :value="30"
            indeterminate
        />
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user'

const drawer = ref(false)
const userStore = useUserStore()
const toast = useToast()

onMounted(async () => {
    // 确保登录状态已校验，避免布局抖动
    await userStore.fetchUserInfo()
})

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
