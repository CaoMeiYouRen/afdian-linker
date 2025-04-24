<template>
    <v-card class="mx-auto my-12" max-width="500">
        <v-card-title class="pa-6 text-center text-h5">
            找回密码
        </v-card-title>
        <v-form @submit.prevent="handleSubmit">
            <v-card-text>
                <v-text-field
                    v-model="email"
                    label="邮箱"
                    required
                    outlined
                    prepend-inner-icon="mdi-email"
                    :rules="[v => !!v || '请输入邮箱']"
                />
            </v-card-text>
            <v-card-actions class="pb-6 px-6">
                <v-btn
                    type="submit"
                    color="primary"
                    block
                    :loading="loading"
                >
                    发送重置邮件
                </v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
const email = ref('')
const loading = ref(false)
const toast = useToast()
async function handleSubmit() {
    loading.value = true
    try {
        const { data } = await useFetch('/api/auth/forgot-password', {
            method: 'POST',
            body: { email: email.value },
        })
        toast.add({
            severity: 'success',
            summary: '提示',
            detail: data.value?.message || '如果该邮箱已注册且已验证，将收到重置密码邮件',
            life: 5000,
        })
    } finally {
        loading.value = false
    }
}
</script>
