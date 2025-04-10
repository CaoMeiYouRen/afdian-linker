<template>
    <v-card
        class="mx-auto my-12"
        max-width="800"
        min-width="500"
    >
        <v-card-title class="pa-6 text-center text-h5">
            修改密码
        </v-card-title>

        <v-form @submit.prevent="handleSubmit">
            <v-card-text>
                <v-text-field
                    v-model="form.oldPassword"
                    label="当前密码"
                    type="password"
                    required
                    outlined
                    prepend-inner-icon="mdi-lock"
                    :rules="[v => !!v || '当前密码不能为空']"
                />

                <v-text-field
                    v-model="form.newPassword"
                    label="新密码"
                    type="password"
                    required
                    outlined
                    prepend-inner-icon="mdi-lock-plus"
                    :rules="passwordRules"
                />

                <v-text-field
                    v-model="form.confirmPassword"
                    label="确认新密码"
                    type="password"
                    required
                    outlined
                    prepend-inner-icon="mdi-lock-check"
                    :rules="[
                        v => !!v || '请确认新密码',
                        v => v === form.newPassword || '两次输入的密码不一致'
                    ]"
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
                    确认修改
                </v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

const form = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
})

const loading = ref(false)
const router = useRouter()
const toast = useToast()

const passwordRules = [
    (v: string) => !!v || '新密码不能为空',
    (v: string) => v.length >= 8 || '密码长度至少为8位',
    (v: string) => /[A-Z]/.test(v) || '密码需包含大写字母',
    (v: string) => /[a-z]/.test(v) || '密码需包含小写字母',
    (v: string) => /[0-9]/.test(v) || '密码需包含数字',
]

async function handleSubmit() {
    if (form.newPassword !== form.confirmPassword) {
        toast.add({
            severity: 'warn',
            summary: '警告',
            detail: '两次输入的密码不一致',
            life: 5000,
        })
        return
    }

    loading.value = true
    try {
        const { data } = await useFetch('/api/auth/change-password', {
            method: 'POST',
            body: {
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
            },
        })

        if (data.value?.statusCode === 200) {
            toast.add({
                severity: 'success',
                summary: '成功',
                detail: '密码修改成功',
                life: 3000,
            })
            router.push('/admin')
            return
        }
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: data.value?.message || '登录失败',
            life: 5000,
        })
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: '错误',
            detail: error.message || '修改密码失败',
            life: 5000,
        })
    } finally {
        loading.value = false
    }
}
</script>
