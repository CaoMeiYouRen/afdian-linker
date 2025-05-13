<template>
    <div class="verify-success-page">
        <v-container class="py-16 text-center">
            <v-icon
                :color="status === 'success' ? 'success' : 'error'"
                size="64"
            >
                {{ status === 'success' ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
            <h2 class="mb-2 mt-4">
                {{ status === 'success' ? '邮箱验证成功' : '邮箱验证失败' }}
            </h2>
            <p v-if="status === 'success'">
                正在跳转到个人资料页...
            </p>
            <p v-else>
                {{ message || '验证链接已失效或无效，正在跳转到个人资料页...' }}
            </p>
        </v-container>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

definePageMeta({
    layout: 'blank',
})

const route = useRoute()
const status = route.query.status === 'success' ? 'success' : 'fail'
const message = route.query.message as string || ''

import { onMounted } from 'vue'
import { useTimeoutFn } from '@vueuse/core'

onMounted(() => {
    useTimeoutFn(() => {
        navigateTo('/profile')
    }, 2000)
})
</script>

<style lang="scss" scoped>
.verify-success-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
