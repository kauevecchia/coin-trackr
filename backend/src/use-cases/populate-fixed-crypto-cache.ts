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

    await Promise.all(
      cryptosFromApi.map((apiCrypto) => {
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

        return this.cryptoCacheRepository.upsertPrice(
          apiCrypto.symbol,
          createData,
          priceUpdate,
        )
      }),
    )

    WebSocketService.broadcastPriceUpdate()
  }
}
