import { Prisma, CryptoPriceCache } from '@/generated/prisma'

export interface CryptoPriceCacheRepository {
  findBySymbol(symbol: string): Promise<CryptoPriceCache | null>

  create(
    data: Prisma.CryptoPriceCacheUncheckedCreateInput,
  ): Promise<CryptoPriceCache>

  upsert(
    symbol: string,
    createData: Prisma.CryptoPriceCacheCreateInput,
    updateData: Prisma.CryptoPriceCacheUpdateInput,
  ): Promise<CryptoPriceCache>

  delete(symbol: string): Promise<void>
}
