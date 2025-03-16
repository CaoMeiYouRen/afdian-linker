import Afdian from '@cao-mei-you-ren/afdian'

export const useAfdian = () => {
    const config = useRuntimeConfig()

    const client = new Afdian({
        userId: config.afdianUserId as string,
        token: config.afdianToken as string,
    })
    const handleWebhook = async (data: any) => {
        const result = await client.webhookOrder(data)
        return result.data?.order
    }

    return {
        client,
        handleWebhook,
    }
}
