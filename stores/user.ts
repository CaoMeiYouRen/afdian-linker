import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import type { DateToString } from '@/types/base'

export interface UserState {
    userInfo: DateToString<User> | null
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        userInfo: null,
    }),

    getters: {
        isAdmin: (state) => state.userInfo?.role === 'ADMIN',
        isLoggedIn: (state) => !!state.userInfo?.id,
    },

    actions: {
        setUserInfo(info: UserState['userInfo']) {
            this.userInfo = info
        },

        clearUserInfo() {
            this.userInfo = null
        },
        async verifyLogin() {
            try {
                const response = await $fetch('/api/auth/verify', { method: 'POST' })
                if (response.statusCode === 200) {
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
                const response = await $fetch('/api/user/info') as any
                if (response.statusCode === 200) {
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
