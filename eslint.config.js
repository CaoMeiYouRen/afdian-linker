import cmyrConfig from 'eslint-config-cmyr/nuxt'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(cmyrConfig, {
    rules: {
        'no-undef': 'warn',
        'implicit-arrow-linebreak': 'warn',
        'vue/require-name-property': 'off',
        'vue/multi-word-component-names': 'off',
        'no-console': 'warn',
        'vue/valid-v-slot': 'off',
    },
})
