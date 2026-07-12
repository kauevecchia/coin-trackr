import { fetchFixedCryptosFromCryptoCompare } from '@/lib/cryptocompare'
import { CryptoCacheRepository } from '@/repositories/crypto-cache-repository'
import { Prisma } from '@/generated/prisma'
import { Decimal } from '@prisma/client/runtime/library'
import { WebSocketService } from '@/services/websocket.service'

export class PopulateFixedCryptoCacheUseCase {
  constructor(private cryptoCacheRepository: CryptoCacheRepository) {}

  async execute() {
    let cryptosFromApi
    try {
      cryptosFromApi = await fetchFixedCryptosFromCryptoCompare()
    } catch (error) {
      throw new Error(
        'Failed to fetch crypto details from external API for cache population.',
      )
    }

    if (!cryptosFromApi || cryptosFromApi.length === 0) {
      return
    }

    const now = new Date()

    for (const apiCrypto of cryptosFromApi) {
      const price = new Decimal(apiCrypto.price?.toString() || '0')

      const createData: Prisma.CryptoCacheCreateInput = {
        symbol: apiCrypto.symbol,
        name: apiCrypto.name,
        price,
        image_url: null,
        last_updated: now,
      }

      const priceUpdate: Prisma.CryptoCacheUpdateInput = {
        price,
        last_updated: now,
      }

      await this.cryptoCacheRepository.upsertPrice(
        apiCrypto.symbol,
        createData,
        priceUpdate,
      )
    }

    WebSocketService.broadcastPriceUpdate()
  }
}
