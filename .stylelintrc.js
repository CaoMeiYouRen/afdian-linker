/** @type {import('stylelint').Config} */
export default {
    extends: ['stylelint-config-cmyr'],
    rules: {
        'alpha-value-notation': 'number', // 强制使用数字而不是百分比来表示 alpha 通道的值
        'color-hex-length': 'short', // 强制使用简写的十六进制颜色值（例如 #fff 而不是 #ffffff）
        'color-function-notation': 'legacy', // 强制使用传统的颜色函数表示法（例如 rgb() 而不是 rgb[]）
    },
}
