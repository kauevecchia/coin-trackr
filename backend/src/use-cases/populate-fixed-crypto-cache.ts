import { fetchFixedCryptosFromCoinMarketCap } from '@/lib/coinmarketcap'
import { CryptoCacheRepository } from '@/repositories/crypto-cache-repository'
import { Prisma } from '@/generated/prisma'
import { Decimal } from '@prisma/client/runtime/library'
import { WebSocketService } from '@/services/websocket.service'

export class PopulateFixedCryptoCacheUseCase {
  constructor(private cryptoCacheRepository: CryptoCacheRepository) {}

  async execute() {
    let cryptosFromApi
    try {
      cryptosFromApi = await fetchFixedCryptosFromCoinMarketCap()
    } catch (error) {
      throw new Error(
        'Failed to fetch crypto details from external API for cache population.',
      )
    }

    if (!cryptosFromApi || cryptosFromApi.length === 0) {
      return
    }

    const now = new Date()

    const items = cryptosFromApi.map((apiCrypto) => {
      const price = new Decimal(apiCrypto.price?.toString() || '0')

      return {
        symbol: apiCrypto.symbol,
        createData: {
          symbol: apiCrypto.symbol,
          name: apiCrypto.name,
          price,
          image_url: null,
          last_updated: now,
        } satisfies Prisma.CryptoCacheCreateInput,
        priceUpdate: {
          price,
          last_updated: now,
        } satisfies Prisma.CryptoCacheUpdateInput,
      }
    })

    await this.cryptoCacheRepository.bulkUpsertPrice(items)

    WebSocketService.broadcastPriceUpdate()
  }
}
