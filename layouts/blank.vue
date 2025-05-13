<template>
    <v-app>
        <v-layout v-if="userStore.isReady" style="min-width: 100vw;width:100%;">
            <v-main>
                <slot />
            </v-main>
        </v-layout>
        <div v-else style="min-height:100vh;min-width: 100vw;width:100%;display:flex;align-items:center;justify-content:center;">
            <v-progress-circular
                color="primary"
                :size="128"
                :width="7"
                :value="30"
                indeterminate
            />
        </div>
    </v-app>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const toast = useToast()

onMounted(async () => {
    // 确保登录状态已校验，避免布局抖动
    await userStore.fetchUserInfo()
})

</script>

<style lang="scss" scoped>
// @import "@/assets/responsive.scss";
</style>
