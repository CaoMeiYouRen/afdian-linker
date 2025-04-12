<template>
    <v-form
        ref="form"
        v-model="isValid"
        @submit.prevent="$emit('submit', form)"
    >
        <v-select
            v-model="form.months"
            :items="monthOptions"
            label="支持时长"
            required
            :rules="[v => !!v || '请选择支持时长']"
        />

        <v-text-field
            v-model.number="form.amount"
            label="金额"
            type="number"
            min="1"
            required
            :rules="[
                v => !!v || '请输入金额',
                v => v > 0 || '金额必须大于0'
            ]"
        />

        <v-textarea
            v-model="form.remark"
            label="留言"
            rows="3"
            maxlength="200"
            counter
        />

        <slot name="actions">
            <v-btn
                type="submit"
                color="primary"
                block
            >
                提交
            </v-btn>
        </slot>
    </v-form>
</template>

<script setup lang="ts">
interface PaymentForm {
    amount: number
    months: number
    remark: string
}

const monthOptions = [
    { title: '1个月', value: 1 },
    { title: '3个月', value: 3 },
    { title: '6个月', value: 6 },
    { title: '12个月', value: 12 },
]

const form = reactive<PaymentForm>({
    amount: 0,
    months: 1,
    remark: '',
})

const isValid = ref(false)

defineEmits<{
    (e: 'submit', form: PaymentForm): void
}>()
</script>
