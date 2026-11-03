import crypto from 'crypto'
import { defineEventHandler, deleteCookie, getCookie, getQuery, sendRedirect } from 'h3'
import { createSyntheticEmail, exchangeCodeForToken, fetchUserInfo, getVerifiedOAuthEmail } from '@/server/utils/oauth'
import { getDataSource } from '@/server/utils/database'
import { User, UserRole } from '@/server/entities/user'
import { setAuthSession } from '@/server/utils/session'
import { getCacheStore } from '@/server/utils/cache'
import { OAUTH_STATE_COOKIE } from '@/server/types/oauth'

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

        // 校验 state 是否绑定当前浏览器，防止攻击者把自己的授权回调发给受害者
        // 仅服务端缓存中的 state 不足以防止登录 CSRF
        const stateCookie = getCookie(event, OAUTH_STATE_COOKIE)
        if (!stateCookie || stateCookie !== state) {
            return sendRedirect(event, `/oauth-callback?status=fail&message=${encodeURIComponent('状态验证失败或已过期')}`, 302)
        }
        deleteCookie(event, OAUTH_STATE_COOKIE)

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
        if (!userInfo.id) {
            throw createError({
                statusCode: 502,
                message: 'OAuth 用户信息缺少唯一标识',
            })
        }
        const oauthId = `${config.oauthProviderId}_${userInfo.id}`

        // 只有提供商明确验证过的邮箱才可用于匹配/绑定已有账号
        // 未验证邮箱可能属于他人，直接绑定会造成账号接管
        const verifiedEmail = getVerifiedOAuthEmail(userInfo)

        // 仅按 oauthId 查找；已验证邮箱才允许匹配已有账号
        let user = await userRepo.findOneBy({ oauthId })
        if (!user && verifiedEmail) {
            user = await userRepo.findOneBy({ email: verifiedEmail })
        }

        if (!user) {
            // 注册新用户
            user = userRepo.create({
                oauthId,
                // 未验证邮箱不能写入账号邮箱，使用占位邮箱避免占用/冒用他人邮箱
                email: verifiedEmail || createSyntheticEmail('oauth', oauthId),
                username: userInfo.username || userInfo.name || `user_${userInfo.id}`,
                nickname: userInfo.nickname || userInfo.name || userInfo.username || '用户',
                emailVerified: !!verifiedEmail, // 仅信任提供商明确返回的验证状态
                initialEmail: !verifiedEmail, // 如果没有已验证邮箱则标记为初始邮箱
                initialPassword: true, // OAuth 用户需要设置密码
                password: crypto.randomBytes(16).toString('hex'), // 随机生成密码
                role: UserRole.USER,
            })
            await userRepo.save(user)
        } else if (user.oauthId !== oauthId) {
            // 通过已验证邮箱匹配到已有账号
            if (user.oauthId) {
                // 该邮箱已绑定其他 OAuth 身份，拒绝自动登录，避免账号接管
                throw createError({
                    statusCode: 409,
                    message: '该邮箱已绑定其他第三方账号，请使用原登录方式',
                })
            }
            // 如果未绑定 OAuth ID，但邮箱已验证且相同，则绑定 OAuth ID
            user.oauthId = oauthId
            if (verifiedEmail) {
                user.emailVerified = true
            }
            await userRepo.save(user)
        } else if (verifiedEmail && user.email === verifiedEmail && !user.emailVerified) {
            // 如果用户未验证邮箱，且 OAuth 已验证同一邮箱，则更新邮箱验证状态
            user.emailVerified = true
            await userRepo.save(user)
        }

        // 创建会话
        setAuthSession(event, {
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
