import { Request, Response } from 'express'
import { makePopulateFixedCryptoCacheUseCase } from '@/use-cases/factories/make-populate-fixed-crypto-cache-use-case'
import { WebSocketService } from '@/services/websocket.service'

export async function updatePrices(request: Request, response: Response) {
  try {
    console.log('🚀 Starting crypto price update via HTTP endpoint...')

    const populateCryptoCacheUseCase = makePopulateFixedCryptoCacheUseCase()
    await populateCryptoCacheUseCase.execute()

    WebSocketService.broadcastPriceUpdate()

    console.log('✅ Crypto price update via HTTP endpoint completed successfully')

    return response.status(200).json({
      message: 'Crypto prices updated successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error updating crypto prices:', error)

    return response.status(500).json({
      error: 'Failed to update crypto prices',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}