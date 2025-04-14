export interface ApiResponse<T = any> {
    statusCode: number
    statusMessage: string
    message: string
    data?: T
}

export function createApiResponse<T>(data?: T, statusCode = 200, message = 'ok'): ApiResponse<T> {
    return {
        statusCode,
        statusMessage: getStatusMessage(statusCode),
        message,
        data,
    }
}

export function getStatusMessage(code: number): string {
    const messages: Record<number, string> = {
        '200': 'OK',
        '201': 'Created',
        '204': 'No Content',
        '301': 'Moved Permanently',
        '302': 'Found',
        '304': 'Not Modified',
        '400': 'Bad Request',
        '401': 'Unauthorized',
        '403': 'Forbidden',
        '404': 'Not Found',
        '408': 'Request Timeout',
        '429': 'Too Many Requests',
        '500': 'Internal Server Error',
        '501': 'Not Implemented',
        '502': 'Bad Gateway',
        '503': 'Service Unavailable',
        '504': 'Gateway Timeout',
    }
    return messages[code] || 'Unknown'
}
