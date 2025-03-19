const __ERROR__ = process.env.NODE_ENV === 'production' ? 2 : 0
const __WARN__ = process.env.NODE_ENV === 'production' ? 1 : 0
module.exports = {
    root: true,
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
    },
}
