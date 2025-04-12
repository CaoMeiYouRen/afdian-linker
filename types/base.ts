export interface BaseFields {
    id: string
    createdAt: string
    updatedAt: string
}

// 将 Date 转换为 string 的工具类型
export type DateToString<T> = {
    [K in keyof T]: T[K] extends Date ? string : T[K]
}

// 将可选字段标记为可选的工具类型
export type PartialFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
