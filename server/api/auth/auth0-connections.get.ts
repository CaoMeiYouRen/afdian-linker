import { defineEventHandler } from 'h3'
import { ManagementClient } from 'auth0'
import { createApiResponse } from '@/server/types/api'
import { getCacheStore } from '@/server/utils/cache'

const AUTH0_CLIENT_ID = process.env.VITE_AUTH0_CLIENT_ID || 'YOUR_AUTH0_CLIENT_ID'
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || process.env.VITE_AUTH0_DOMAIN || 'YOUR_AUTH0_DOMAIN'
const AUTH0_MGMT_CLIENT_ID = process.env.AUTH0_MGMT_CLIENT_ID || 'YOUR_AUTH0_MGMT_CLIENT_ID'
const AUTH0_MGMT_CLIENT_SECRET = process.env.AUTH0_MGMT_CLIENT_SECRET || 'YOUR_AUTH0_MGMT_CLIENT_SECRET'

const CACHE_KEY = 'AUTH0_ALL_CONNECTIONS'

export default defineEventHandler(async (event) => {
    if (process.env.NODE_ENV === 'development') { // 开发环境返回固定值
        return createApiResponse({
            connections: [
                'Google',
                'GitHub',
                'Microsoft',
            ],
        })
    }
    const cache = getCacheStore()
    const cachedConnections = await cache.get<string[]>(CACHE_KEY)
    if (cachedConnections?.length) {
        return createApiResponse({
            connections: cachedConnections,
        })
    }

    const managementClient = new ManagementClient({
        domain: AUTH0_DOMAIN,
        clientId: AUTH0_MGMT_CLIENT_ID,
        clientSecret: AUTH0_MGMT_CLIENT_SECRET,
    })

    const allConnections = (await managementClient.connections.getAll())?.data ?? []
    const enabledConnections = allConnections.filter(
        (conn: any) => Array.isArray(conn?.enabled_clients) && conn.enabled_clients.includes(AUTH0_CLIENT_ID),
    )
    const filteredConnectionNames = enabledConnections
        .map((conn: any) => conn.name)
        .filter((name: string) => !['email', 'Username-Password-Authentication'].includes(name))
        .map((conn) => {
            if (conn.includes('google')) {
                return 'Google'
            }
            if (conn.includes('github')) {
                return 'GitHub'
            }
            if (conn.includes('windowslive')) {
                return 'Microsoft'
            }
            return conn
        })

    await cache.set(CACHE_KEY, filteredConnectionNames, 1000 * 60 * 60 * 24) // 缓存24小时
    return createApiResponse({
        connections: filteredConnectionNames,
    })
})
