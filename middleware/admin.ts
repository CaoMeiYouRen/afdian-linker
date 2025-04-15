export default defineNuxtRouteMiddleware((to, from) => {
    const userStore = useUserStore()

    // 检查用户是否登录
    if (!userStore.isLoggedIn) {
        // 如果没有登录，重定向到登录页面
        return navigateTo('/login')
    }
    // 如果访问管理界面，检查用户是否为管理员
    if (!userStore.isAdmin && to.path.startsWith('/admin')) {
        // 如果不是管理员，重定向到首页
        return navigateTo('/')
    }
    // 如果是管理员，允许访问
    return true
})
