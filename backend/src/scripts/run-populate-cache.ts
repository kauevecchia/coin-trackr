import { makePopulateFixedCryptoCacheUseCase } from '@/use-cases/factories/make-populate-fixed-crypto-cache-use-case'
import { prisma } from '@/lib/prisma'
import axios from 'axios'

async function main() {
  const useWebhook = process.env.USE_WEBHOOK_FOR_PRICE_UPDATE === 'true'

  if (useWebhook) {
    console.log(
      '[Render Cron Job] Using webhook approach - calling web service endpoint...',
    )

    const webServiceUrl =
      process.env.WEB_SERVICE_URL || process.env.RENDER_SERVICE_URL
    const apiKey = process.env.CRON_API_KEY || process.env.ADMIN_API_KEY

    if (!webServiceUrl) {
      console.error('❌ WEB_SERVICE_URL or RENDER_SERVICE_URL not configured')
      process.exit(1)
    }

    if (!apiKey) {
      console.error('❌ CRON_API_KEY or ADMIN_API_KEY not configured')
      process.exit(1)
    }

    try {
      // First, wake up the service with a health check
      await axios.get(`${webServiceUrl}/health`)

      // Then trigger the price update via webhook
      const response = await axios.post(
        `${webServiceUrl}/cryptos/update-prices-webhook`,
        {},
        {
          params: {
            apiKey,
          },
        },
      )

      console.log('[Render Cron Job] Webhook call successful:', response.data)
      console.log(
        '✅ Prices updated and WebSocket broadcast sent via web service',
      )
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          '[Render Cron Job] Error calling webhook:',
          error.response?.status,
          error.response?.data || error.message,
        )
      } else {
        console.error('[Render Cron Job] Error calling webhook:', error)
      }
      process.exit(1)
    }

    return
  }

  try {
    await prisma.$connect()
    console.log('[Render Cron Job] Prisma connected.')

    const populateUseCase = makePopulateFixedCryptoCacheUseCase()
    await populateUseCase.execute()

    console.log(
      '[Render Cron Job] PopulateFixedCryptoCacheUseCase successfully executed.',
    )
  } catch (error) {
    console.error(
      '[Render Cron Job] Error executing PopulateFixedCryptoCacheUseCase:',
      error,
    )
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    console.log('[Render Cron Job] Prisma disconnected.')
  }
}

main()
