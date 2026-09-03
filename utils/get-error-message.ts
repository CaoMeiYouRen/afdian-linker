export function getErrorMessage(error: unknown): string {
    const err = error as { data?: { message?: string }, message?: string } | null | undefined
    return err?.data?.message || err?.message || ''
}
