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

function getStatusMessage(code: number): string {
    const messages: Record<number, string> = {
        '200': 'OK',
        '201': 'Created',
        '400': 'Bad Request',
        '401': 'Unauthorized',
        '403': 'Forbidden',
        '404': 'Not Found',
        '500': 'Internal Server Error',
    }
    return messages[code] || 'Unknown'
}
