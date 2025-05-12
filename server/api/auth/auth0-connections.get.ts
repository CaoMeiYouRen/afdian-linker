import crypto from 'crypto'
import { defineEventHandler, readBody } from 'h3'
import jwt from 'jsonwebtoken'
import { JwksClient } from 'jwks-rsa'
import { z } from 'zod'
import { AuthenticationClient, ManagementClient } from 'auth0'
import { getDataSource } from '@/server/utils/database'
import { User, UserRole } from '@/server/entities/user'
import { createApiResponse } from '@/server/types/api'
import { JwtPayload } from '@/server/types/auth0'
import { rateLimit } from '@/server/utils/rate-limit'
import { getCacheStore } from '@/server/utils/cache'

const AUTH0_CLIENT_ID = process.env.VITE_AUTH0_CLIENT_ID || 'YOUR_AUTH0_CLIENT_ID'

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || process.env.VITE_AUTH0_DOMAIN || 'YOUR_AUTH0_DOMAIN'
const AUTH0_MGMT_CLIENT_ID = process.env.AUTH0_MGMT_CLIENT_ID || 'YOUR_AUTH0_MGMT_CLIENT_ID'
const AUTH0_MGMT_CLIENT_SECRET = process.env.AUTH0_MGMT_CLIENT_SECRET || 'YOUR_AUTH0_MGMT_CLIENT_SECRET'

const CACHE_KEY = 'AUTH0_ALL_CONNECTIONS'

export default defineEventHandler(async (event) => {
    const store = getCacheStore()
    let value = await store.get<string[]>(CACHE_KEY)
    if (value?.length) {
        return createApiResponse({
            connections: value,
        })
    }

    const management = new ManagementClient({
        domain: AUTH0_DOMAIN,
        clientId: AUTH0_MGMT_CLIENT_ID,
        clientSecret: AUTH0_MGMT_CLIENT_SECRET,
    })
    const connections = (await management.connections.getAll())?.data
    // console.log(connections)
    const enableConnections = connections.filter((connection) => (connection as any).enabled_clients?.includes(AUTH0_CLIENT_ID))
    const connectionNames = enableConnections.map((connection) => connection.name).filter((connection) => !['email', 'Username-Password-Authentication'].includes(connection as string))
    value = connectionNames as string[]
    await store.set(CACHE_KEY, value, 60 * 60 * 24) // 增加缓存
    return createApiResponse({
        connections: value,
    })
})
