import crypto from 'crypto'
import { defineEventHandler, getQuery, sendRedirect } from 'h3'
import { exchangeCodeForToken, fetchUserInfo, validateState } from '@/server/utils/oauth'
import { getDataSource } from '@/server/utils/database'
import { User, UserRole } from '@/server/entities/user'
import { setSession } from '@/server/utils/session'
import { getCacheStore } from '@/server/utils/cache'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)

    try {
        const { code, state, error } = query

        // 检查是否有错误
        if (error) {
            console.error('OAuth 授权错误:', error)
            return sendRedirect(event, `/oauth-callback?status=fail&message=${encodeURIComponent('授权被取消或失败')}`, 302)
        }

        // 检查必需参数
        if (!code || !state) {
            return sendRedirect(event, `/oauth-callback?status=fail&message=${encodeURIComponent('缺少必需的授权参数')}`, 302)
        }

        // 验证状态值防止 CSRF 攻击
        const cache = getCacheStore()
        const storedState = await cache.get(`oauth_state_${state}`)
        if (!storedState) {
            return sendRedirect(event, `/oauth-callback?status=fail&message=${encodeURIComponent('状态验证失败或已过期')}`, 302)
        }

        // 删除已使用的状态值
        await cache.del(`oauth_state_${state}`)

        // 交换授权码获取访问令牌
        const tokenResponse = await exchangeCodeForToken({
            tokenUrl: config.oauthTokenUrl,
            clientId: config.oauthClientId,
            clientSecret: config.oauthClientSecret,
            code: code as string,
            redirectUri: `${config.baseUrl}/api/auth/oauth-callback`,
        })

        // 获取用户信息
        const userInfo = await fetchUserInfo({
            userInfoUrl: config.oauthUserInfoUrl,
            accessToken: tokenResponse.access_token,
        })
        // console.log('userInfo:', userInfo)
        // 处理用户登录/注册
        const dataSource = await getDataSource()
        const userRepo = dataSource.getRepository(User)

        // 生成 OAuth 用户标识，使用提供商名称前缀避免冲突
        const oauthId = `${config.oauthProviderId}_${userInfo.id}`

        // 先根据 oauthId 查找用户，如果没有再根据 email 查找用户
        let user = await userRepo.findOneBy([
            { oauthId },
            ...userInfo.email ? [{ email: userInfo.email }] : [],
        ])

        if (!user) {
            // 注册新用户
            user = userRepo.create({
                oauthId,
                email: userInfo.email || `${oauthId}@oauth.local`,
                username: userInfo.username || userInfo.name || `user_${userInfo.id}`,
                nickname: userInfo.nickname || userInfo.name || userInfo.username || '用户',
                emailVerified: !!userInfo.email, // 如果有邮箱就认为已验证
                initialEmail: !userInfo.email, // 如果没有邮箱则标记为初始邮箱
                initialPassword: true, // OAuth 用户需要设置密码
                password: crypto.randomBytes(16).toString('hex'), // 随机生成密码
                role: UserRole.USER,
            })
            await userRepo.save(user)
        } else {
            // 如果未绑定 OAuth ID，但邮箱相同，则绑定 OAuth ID
            if (!user.oauthId && userInfo.email && user.email === userInfo.email) {
                user.oauthId = oauthId
                await userRepo.save(user)
            }
            // 如果用户未验证邮箱，且 OAuth 提供了邮箱，则更新邮箱验证状态
            if (userInfo.email && user.email === userInfo.email && !user.emailVerified) {
                user.emailVerified = true
                await userRepo.save(user)
            }
        }

        // 创建会话
        setSession(event, {
            id: user.id,
            role: user.role,
        })

        // 重定向到成功页面
        return sendRedirect(event, '/oauth-callback?status=success', 302)

    } catch (error: any) {
        console.error('OAuth 回调处理失败:', error)
        return sendRedirect(event, `/oauth-callback?status=fail&message=${encodeURIComponent(error.message || 'OAuth 登录失败')}`, 302)
    }
})
