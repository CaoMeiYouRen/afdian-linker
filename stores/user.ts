import { defineStore } from 'pinia'

interface UserState {
    isLoggedIn: boolean
    userInfo: {
        nickname: string
        username: string
        email: string
        role: string
        id: string
        initialPassword: boolean
        initialEmail: boolean
        createdAt: string
        updatedAt: string
    } | null
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        isLoggedIn: false,
        userInfo: null,
    }),

    getters: {
        isAdmin: (state) => state.userInfo?.role === 'ADMIN',
    },

    actions: {
        setLoginState(status: boolean) {
            this.isLoggedIn = status
        },

        setUserInfo(info: UserState['userInfo']) {
            this.userInfo = info
        },

        clearUserInfo() {
            this.isLoggedIn = false
            this.userInfo = null
        },

        async verifyLogin() {
            try {
                const response = await $fetch('/api/auth/verify')
                if (response.statusCode === 200) {
                    this.isLoggedIn = true
                    this.userInfo = response.data || null
                    return true
                }
                return false
            } catch (error) {
                console.error('验证登录状态失败:', error)
                return false
            }
        },
    },
})
