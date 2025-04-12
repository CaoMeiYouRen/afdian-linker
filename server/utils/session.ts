import { H3Event } from 'h3'
import jwt from 'jsonwebtoken'

export const SESSION_KEY = 'auth_session'

export interface Session {
    id: string
    role: string
}

export function setSession(event: H3Event, session: Session) {
    const token = sign(session)
    setCookie(event, SESSION_KEY, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 1 day
    })
    return token
}

export function getSession(event: H3Event): Session | null {
    const token = getCookie(event, SESSION_KEY)
    if (!token) {
        return null
    }
    return verify(token)
}

export async function clearSession(event: H3Event) {
    deleteCookie(event, SESSION_KEY)
}

function sign(data: any) {
    const token = jwt.sign(
        data,
        useRuntimeConfig().jwtSecret,
        { expiresIn: 86400 }, // 1 day
    )
    return token
}

function verify(token: string) {
    const decoded = jwt.verify(token, useRuntimeConfig().jwtSecret) as Session
    return decoded
}
