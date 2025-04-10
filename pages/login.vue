<template>
    <v-card
        class="mx-auto my-12"
        max-width="800"
        min-width="500"
    >
        <v-card-title class="pa-6 text-center text-h5">
            登录
        </v-card-title>

        <v-form @submit.prevent="handleSubmit">
            <v-card-text>
                <v-text-field
                    v-model="form.username"
                    label="用户名"
                    required
                    outlined
                    prepend-inner-icon="mdi-account"
                    :rules="[v => !!v || '用户名不能为空']"
                />

                <v-text-field
                    v-model="form.password"
                    label="密码"
                    type="password"
                    required
                    outlined
                    prepend-inner-icon="mdi-lock"
                    :rules="[v => !!v || '密码不能为空']"
                />
            </v-card-text>

            <v-card-actions class="pb-6 px-6">
                <v-btn
                    type="submit"
                    color="primary"
                    block
                    large
                    :loading="loading"
                >
                    登录
                </v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

interface LoginResponse {
    success: boolean
    requirePasswordChange?: boolean
    error?: string
}

const form = reactive({
    username: '',
    password: '',
})
const loading = ref(false)
const router = useRouter()
const toast = useToast()

async function handleSubmit() {
    loading.value = true
    try {
        const { data } = await useFetch<LoginResponse>('/api/auth/login', {
            method: 'POST',
            body: form,
        })
        if (data.value?.success) {
            toast.add({
                severity: 'success',
                summary: '登录成功',
                life: 3000,
            })
            await router.push('/admin')
        }
    } catch (error: any) {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: '登录失败',
            detail: error.message || '请检查用户名和密码',
            life: 3000,
        })
    } finally {
        loading.value = false
    }
}
</script>

<style>
html {
    background: #f5f5f5;
}
</style>
