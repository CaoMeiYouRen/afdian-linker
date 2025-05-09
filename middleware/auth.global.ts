import { publicPaths } from '@/utils/public-paths'

export default defineNuxtRouteMiddleware(async (to, from) => {

    // 只在客户端执行，避免SSR重复请求
    if (import.meta.server) {
        return true
    }

    // 白名单路径
    if (publicPaths.some((path) => to.path === path)) {
        return true
    }

    const userStore = useUserStore()

    // 检查用户是否登录
    if (!userStore.isLoggedIn) {
        await userStore.fetchUserInfo()
    }
    // 重定向到登录页面
    if (!userStore.isLoggedIn) { // && !to.path.startsWith('/login')
        // return navigateTo('/login')
        return false
    }
    // 如果访问管理界面，检查用户是否为管理员
    if (!userStore.isAdmin && to.path.startsWith('/admin')) {
        // 如果不是管理员，拒绝访问
        return false
    }
    // 如果是管理员，允许访问
    return true
})
