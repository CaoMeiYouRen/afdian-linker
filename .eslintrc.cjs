const __ERROR__ = process.env.NODE_ENV === 'production' ? 2 : 0
const __WARN__ = process.env.NODE_ENV === 'production' ? 1 : 0
module.exports = {
    root: true,
    globals: {
        $fetch: true,
        useFetch: true,
        useRuntimeConfig: true,
        deleteCookie: true,
        getCookie: true,
        setCookie: true,
        createError: true,
        getRequestIP: true,
        sendRedirect: true,
        defineEventHandler: true,
        ref: true,
    }, // 处理 nuxt 和 vue 组件的全局变量
    extends: [
        'cmyr/vue3',
    ],
    rules: {
        'no-undef': [__WARN__],
        'implicit-arrow-linebreak': [1],
        'import/no-named-as-default': [0],
        'vue/require-name-property': [0],
        '@typescript-eslint/ban-types': [1],
        'vue/multi-word-component-names': [0],
        'no-console': [__WARN__],
        'vue/valid-v-slot': [0],
    },
}
