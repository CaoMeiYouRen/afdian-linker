<template>
    <div class="verify-success-page">
        <v-container class="py-16 text-center">
            <v-icon color="success" size="64">
                mdi-check-circle
            </v-icon>
            <h2 class="mb-2 mt-4">
                邮箱验证成功
            </h2>
            <p>正在跳转到个人资料页...</p>
        </v-container>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'blank',
})

import { onMounted } from 'vue'
import { useTimeoutFn } from '@vueuse/core'

onMounted(() => {
    useTimeoutFn(() => {
        navigateTo('/profile')
    }, 2000)
})
</script>

<style scoped>
.verify-success-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
