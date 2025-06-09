import { Prisma, CryptoCache } from '@/generated/prisma'

export interface CryptoCacheRepository {
  findBySymbol(symbol: string): Promise<CryptoCache | null>

  create(data: Prisma.CryptoCacheUncheckedCreateInput): Promise<CryptoCache>

  upsert(
    symbol: string,
    data: Prisma.CryptoCacheCreateInput,
  ): Promise<CryptoCache>

  delete(symbol: string): Promise<void>
}
