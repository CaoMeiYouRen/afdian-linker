import { H3Event } from 'h3'

export const SESSION_KEY = 'auth_session'

interface Session {
    userId: string
    requirePasswordChange?: boolean
}

export async function setSession(event: H3Event, session: Session) {
    const signed = await sign(session)
    setCookie(event, SESSION_KEY, signed, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    })
}

export async function getSession(event: H3Event): Promise<Session | null> {
    const signed = getCookie(event, SESSION_KEY)
    if (!signed) {
        return null
    }
    return verify(signed)
}

export async function clearSession(event: H3Event) {
    deleteCookie(event, SESSION_KEY)
}

async function sign(data: any): Promise<string> {
    return JSON.stringify(data)
}

async function verify(signed: string): Promise<any> {
    return JSON.parse(signed)
}
