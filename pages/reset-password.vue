<template>
    <v-card class="mx-auto my-12" max-width="500">
        <v-card-title class="pa-6 text-center text-h5">
            重置密码
        </v-card-title>
        <v-form @submit.prevent="handleSubmit">
            <v-card-text>
                <v-text-field
                    v-model="form.password"
                    label="新密码"
                    type="password"
                    required
                    outlined
                    prepend-inner-icon="mdi-lock"
                    :rules="passwordRules"
                />
                <v-text-field
                    v-model="form.confirm"
                    label="确认新密码"
                    type="password"
                    required
                    outlined
                    prepend-inner-icon="mdi-lock-check"
                    :rules="[
                        v => !!v || '请确认新密码',
                        v => v === form.password || '两次输入的密码不一致'
                    ]"
                />
            </v-card-text>
            <v-card-actions class="pb-6 px-6">
                <v-btn
                    type="submit"
                    color="primary"
                    block
                    :loading="loading"
                >
                    确认重置
                </v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'blank',
})

import { useToast } from 'primevue/usetoast'
const route = useRoute()
const toast = useToast()
const loading = ref(false)
const form = reactive({ password: '', confirm: '' })
const passwordRules = [
    (v: string) => !!v || '新密码不能为空',
    (v: string) => v.length >= 6 || '密码长度至少为6位',
]
async function handleSubmit() {
    if (form.password !== form.confirm) {
        toast.add({ severity: 'warn', summary: '警告', detail: '两次输入的密码不一致', life: 5000 })
        return
    }
    loading.value = true
    try {
        const { data, error } = await useFetch('/api/auth/reset-password', {
            method: 'POST',
            body: { token: route.query.token, password: form.password },
        })
        if (data.value?.statusCode === 200) {
            toast.add({ severity: 'success', summary: '成功', detail: '密码重置成功', life: 3000 })
            navigateTo('/login')
            return
        }
        throw new Error(error.value?.data?.message || error.value?.message || '重置失败')
    } catch (e: any) {
        toast.add({ severity: 'error', summary: '错误', detail: e.message || '重置失败', life: 5000 })
    } finally {
        loading.value = false
    }
}
</script>
