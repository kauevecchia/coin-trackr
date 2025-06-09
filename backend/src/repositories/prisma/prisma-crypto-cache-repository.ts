import { prisma } from '@/lib/prisma'
import { CryptoCacheRepository } from '../crypto-cache-repository'
import { Prisma } from '@/generated/prisma'

export class PrismaCryptoCacheRepository implements CryptoCacheRepository {
  async findBySymbol(symbol: string) {
    const crypto = await prisma.cryptoCache.findUnique({
      where: {
        symbol,
      },
    })

    return crypto
  }

  async create(data: Prisma.CryptoCacheUncheckedCreateInput) {
    const crypto = await prisma.cryptoCache.create({
      data,
    })

    return crypto
  }

  async upsert(symbol: string, data: Prisma.CryptoCacheCreateInput) {
    const crypto = await prisma.cryptoCache.upsert({
      where: {
        symbol,
      },
      create: data,
      update: data,
    })

    return crypto
  }

  async delete(symbol: string) {
    await prisma.cryptoCache.delete({
      where: {
        symbol,
      },
    })
  }
}
