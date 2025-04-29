<template>
    <v-card
        class="mx-auto my-12"
        max-width="800"
        min-width="500"
    >
        <v-card-title class="pa-6 text-center text-h5">
            修改密码
        </v-card-title>
        <v-divider />
        <p class="pa-4 text-center">
            请填写当前密码和新密码，密码长度至少为6位。
            <br>
            密码建议包含大写字母、小写字母和数字。
            <br>
            <span class="text-red-darken-2">注意：通过第三方注册的用户，请通过「忘记密码」页面重置初始密码。</span>
        </p>
        <v-divider />
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
                    variant="elevated"
                    block
                    large
                    :loading="loading"
                    elevation="2"
                >
                    确认修改
                </v-btn>
            </v-card-actions>

            <div class="pb-6 text-center">
                <v-tooltip text="点击前往「忘记密码」页面重置初始密码" location="top">
                    <template #activator="{props}">
                        <v-btn
                            variant="text"
                            color="secondary"
                            class="ml-2"
                            v-bind="props"
                            @click="goToForgot"
                        >
                            忘记密码？
                        </v-btn>
                    </template>
                </v-tooltip>
            </div>
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
const toast = useToast()

const passwordRules = [
    (v: string) => !!v || '新密码不能为空',
    (v: string) => v.length >= 6 || '密码长度至少为6位',
    // (v: string) => /[A-Z]/.test(v) || '密码需包含大写字母',
    // (v: string) => /[a-z]/.test(v) || '密码需包含小写字母',
    // (v: string) => /[0-9]/.test(v) || '密码需包含数字',
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
        const { data, error } = await useFetch('/api/auth/change-password', {
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
            navigateTo('/')
            return
        }
        throw new Error(error.value?.data?.message || error.value?.message || '修改密码失败')
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

function goToForgot() {
    navigateTo('/forgot-password')
}

</script>
