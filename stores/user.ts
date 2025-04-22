import { defineStore } from 'pinia'
import type { DateToString } from '@/types/base'
import { UserRole, type User } from '@/types/user'

export interface UserState {
    userInfo: DateToString<User> | null
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        userInfo: null,
    }),

    getters: {
        isAdmin: (state) => state.userInfo?.role === UserRole.ADMIN,
        isLoggedIn: (state) => !!state.userInfo?.id,
    },

    actions: {
        setUserInfo(info: UserState['userInfo']) {
            this.userInfo = info
        },

        clearUserInfo() {
            this.userInfo = null
        },
        /**
         * @deprecated 改用 fetchUserInfo
         */
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
                // 只在客户端执行，避免SSR重复请求
                if (import.meta.server) {
                    return false
                }
                const { data } = await useFetch('/api/user/info') as any
                if (data.value?.statusCode === 200) {
                    this.userInfo = data.value.data || null
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
