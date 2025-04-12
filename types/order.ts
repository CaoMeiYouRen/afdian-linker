import { type Order, type OrderStatus, orderStatusMap, orderStatusColorMap } from './entity'

export type { Order, OrderStatus }
export { orderStatusMap, orderStatusColorMap }

// 获取展示用的文本和颜色
export const getStatusText = (status: OrderStatus) => orderStatusMap[status] || status
export const getStatusColor = (status: OrderStatus) => orderStatusColorMap[status] || 'default'
