<template>
    <v-app>
        <!-- 顶部导航栏 -->
        <v-app-bar>
            <v-app-bar-nav-icon @click="drawer = !drawer" />
            <v-app-bar-title>爱发电助手</v-app-bar-title>
            <v-spacer />
            <template v-if="userStore.isLoggedIn">
                <v-btn
                    text
                    @click="handleLogout"
                >
                    退出登录
                </v-btn>
            </template>
            <template v-else>
                <v-btn
                    text
                    to="/login"
                >
                    登录
                </v-btn>
            </template>
        </v-app-bar>

        <!-- 侧边导航栏 -->
        <v-navigation-drawer
            v-model="drawer"
            temporary
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
                        to="/admin/webhooks"
                        :title="'Webhook日志'"
                        prepend-icon="mdi-webhook"
                    />
                </template>
            </v-list>
        </v-navigation-drawer>

        <!-- 页面主体内容 -->
        <v-main>
            <slot />
        </v-main>
    </v-app>
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
onMounted(async () => {
    await userStore.verifyLogin()
})
</script>
