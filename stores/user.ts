import { defineStore } from 'pinia'
import type { BaseUser } from '@/types/user'
import type { DateToString } from '@/types/base'

interface UserState {
    isLoggedIn: boolean
    userInfo: DateToString<BaseUser> | null
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
                const response = await $fetch('/api/auth/verify', { method: 'POST' })
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
        async fetchUserInfo() {
            try {
                const response = await $fetch('/api/user/info')
                if (response.statusCode === 200) {
                    this.isLoggedIn = true
                    this.userInfo = response.data || null
                    return true
                }
                return false
            } catch (error) {
                console.error('获取用户信息失败:', error)
                return false
            }
        },
    },
})
