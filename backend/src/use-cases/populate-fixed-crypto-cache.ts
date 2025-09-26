import { fetchFixedCryptosFullDetails } from '@/lib/coingecko'
import { CryptoCacheRepository } from '@/repositories/crypto-cache-repository'
import { Prisma } from '@/generated/prisma'
import { Decimal } from '@prisma/client/runtime/library'
import { WebSocketService } from '@/services/websocket.service'

export class PopulateFixedCryptoCacheUseCase {
  constructor(private cryptoCacheRepository: CryptoCacheRepository) {}

  async execute() {
    let cryptoDetailsFromApi
    try {
      cryptoDetailsFromApi = await fetchFixedCryptosFullDetails()
    } catch (error) {
      throw new Error(
        'Failed to fetch crypto details from external API for cache population.',
      )
    }

    if (!cryptoDetailsFromApi || cryptoDetailsFromApi.length === 0) {
      return
    }

    const now = new Date()

    for (const apiCrypto of cryptoDetailsFromApi) {
      const newPrice = new Decimal(apiCrypto.current_price?.toString() || '0')
      const imageUrl = apiCrypto.image || null

      const upsertData: Prisma.CryptoCacheCreateInput = {
        symbol: apiCrypto.symbol.toUpperCase(),
        name: apiCrypto.name,
        price: newPrice,
        image_url: imageUrl,
        last_updated: now,
      }

      await this.cryptoCacheRepository.upsert(
        apiCrypto.symbol.toUpperCase(),
        upsertData,
      )
    }

    // notify via WebSocket that prices have been updated
    WebSocketService.broadcastPriceUpdate()
  }
}
