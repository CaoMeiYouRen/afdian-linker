export default defineNuxtRouteMiddleware((to, from) => {
    const userStore = useUserStore()

    // 检查用户是否登录且是管理员
    if (!userStore.isLoggedIn || !userStore.isAdmin) {
        // 如果不是管理员，重定向到首页
        return navigateTo('/')
    }
})
