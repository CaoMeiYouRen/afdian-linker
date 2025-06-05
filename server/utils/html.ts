// HTML转义函数
export function escapeHtml(str: string) {
    return str.replace(/[&<>"']/g, (m) => {
        switch (m) {
            case '&': return '&amp;'
            case '<': return '&lt;'
            case '>': return '&gt;'
            case '"': return '&quot;'
            case '\'': return '&#39;'
            default: return m
        }
    })
}
