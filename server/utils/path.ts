// 请求路径归一化工具
// 参考 GHSA-9v7c-q64q-vv33：Nuxt 页面路由会解析点段（`.`、`..`、`%2e`），
// 而 Nitro 路由与 server/middleware 看到的是原始路径，直接用 event.path 做门禁会被绕过。

const MAX_DECODE_DEPTH = 5

/**
 * 反复解码路径，处理 `%252e` 这类多层编码
 */
export function decodeRequestPath(pathname: string): string {
    let decoded = pathname
    for (let i = 0; i < MAX_DECODE_DEPTH; i += 1) {
        try {
            const next = decodeURIComponent(decoded)
            if (next === decoded) {
                break
            }
            decoded = next
        } catch {
            // 非法编码时停止解码，保留原值交由后续逻辑处理
            break
        }
    }
    return decoded
}

/**
 * 归一化请求路径：去除查询串、解码、统一分隔符、折叠点段
 */
export function normalizeRequestPath(rawPath: string): string {
    const [pathname = '/'] = (rawPath || '/').split(/[?#]/, 1)
    const decoded = decodeRequestPath(pathname).replace(/\\/g, '/')
    const segments: string[] = []
    for (const segment of decoded.split('/')) {
        if (!segment || segment === '.') {
            continue
        }
        if (segment === '..') {
            segments.pop()
            continue
        }
        segments.push(segment)
    }
    return `/${segments.join('/')}`
}

/**
 * 判断路径中是否包含点段（含编码形式）
 */
export function hasDotSegment(rawPath: string): boolean {
    const [pathname = '/'] = (rawPath || '/').split(/[?#]/, 1)
    const decoded = decodeRequestPath(pathname).replace(/\\/g, '/')
    return decoded.split('/').some((segment) => segment === '.' || segment === '..')
}

/**
 * 判断路径是否等于前缀本身，或位于该前缀之下
 */
export function isPathWithin(pathname: string, prefix: string): boolean {
    if (pathname === prefix) {
        return true
    }
    return pathname.startsWith(prefix.endsWith('/') ? prefix : `${prefix}/`)
}

/**
 * 判断是否为管理员路径（大小写不敏感，兼容页面路由的大小写不敏感匹配）
 */
export function isAdminRequestPath(pathname: string): boolean {
    const lowerPath = pathname.toLowerCase()
    return isPathWithin(lowerPath, '/admin') || isPathWithin(lowerPath, '/api/admin')
}
