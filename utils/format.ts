import dayjs from 'dayjs'

export const formatDate = (date: string | Date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')

export const formatCurrency = (amount: number | string, currency: string) => new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: currency || 'CNY',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount))
