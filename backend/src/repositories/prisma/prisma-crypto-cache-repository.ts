import { prisma } from '@/lib/prisma'
import { CryptoCacheRepository } from '../crypto-cache-repository'
import { Prisma } from '@/generated/prisma'

export class PrismaCryptoCacheRepository implements CryptoCacheRepository {
  async findBySymbol(symbol: string) {
    const crypto = await prisma.cryptoPriceCache.findUnique({
      where: {
        symbol,
      },
    })

    return crypto
  }

  async create(data: Prisma.CryptoPriceCacheUncheckedCreateInput) {
    const crypto = await prisma.cryptoPriceCache.create({
      data,
    })

    return crypto
  }

  async upsert(
    symbol: string,
    createData: Prisma.CryptoPriceCacheCreateInput,
    updateData: Prisma.CryptoPriceCacheUpdateInput,
  ) {
    const crypto = await prisma.cryptoPriceCache.upsert({
      where: {
        symbol,
      },
      create: createData,
      update: updateData,
    })

    return crypto
  }

  async delete(symbol: string) {
    await prisma.cryptoPriceCache.delete({
      where: {
        symbol,
      },
    })
  }
}
