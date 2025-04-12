export interface User {
    id: string
    username: string
    nickname: string | null
    email: string
    role: 'ADMIN' | 'USER'
    createdAt: string
    updatedAt: string
    initialPassword: boolean
    initialEmail: boolean
}

export interface WebhookLog {
    id: string
    payload: any
    createdAt: string
}
