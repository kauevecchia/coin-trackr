import { Request, Response } from 'express'
import { makePopulateFixedCryptoCacheUseCase } from '@/use-cases/factories/make-populate-fixed-crypto-cache-use-case'
import { WebSocketService } from '@/services/websocket.service'

/**
 * Endpoint to be called by external cron jobs (Render Cron, etc)
 * This endpoint can be called without authentication, but uses a simple API key
 * to prevent malicious calls
 */
export async function updatePricesWebhook(
  request: Request,
  response: Response,
) {
  // Simple API key check (optional but recommended)
  const providedKey = request.headers['x-api-key'] || request.query.apiKey
  const expectedKey = process.env.CRON_API_KEY || process.env.ADMIN_API_KEY

  if (expectedKey && providedKey !== expectedKey) {
    return response.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key',
    })
  }

  try {
    console.log(
      '🚀 Starting crypto price update via webhook (external cron)...',
    )

    const populateCryptoCacheUseCase = makePopulateFixedCryptoCacheUseCase()
    await populateCryptoCacheUseCase.execute()

    WebSocketService.broadcastPriceUpdate()

    console.log('✅ Crypto price update via webhook completed successfully')

    return response.status(200).json({
      message: 'Crypto prices updated successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error updating crypto prices via webhook:', error)

    return response.status(500).json({
      error: 'Failed to update crypto prices',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
