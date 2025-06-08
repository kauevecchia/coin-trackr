import { CryptoCacheRepository } from '../crypto-cache-repository'
import { CryptoPriceCache, Prisma } from '@/generated/prisma'
import { randomUUID } from 'node:crypto'
import { Decimal } from '@prisma/client/runtime/library'

export class InMemoryCryptoCacheRepository implements CryptoCacheRepository {
  public items: CryptoPriceCache[] = []

  async findBySymbol(symbol: string): Promise<CryptoPriceCache | null> {
    const crypto = this.items.find((item) => item.symbol === symbol)
    return crypto || null
  }

  async create(
    data: Prisma.CryptoPriceCacheUncheckedCreateInput,
  ): Promise<CryptoPriceCache> {
    const newCrypto: CryptoPriceCache = {
      id: randomUUID(),
      symbol: data.symbol,
      name: data.name,
      price: new Decimal(data.price.toString()),
      last_updated: data.last_updated
        ? new Date(data.last_updated)
        : new Date(),
    }

    this.items.push(newCrypto)
    return newCrypto
  }

  async upsert(
    symbol: string,
    createData: Prisma.CryptoPriceCacheCreateInput,
    updateData: Prisma.CryptoPriceCacheUpdateInput,
  ): Promise<CryptoPriceCache> {
    const existingIndex = this.items.findIndex((item) => item.symbol === symbol)

    if (existingIndex >= 0) {
      const updatedItem = {
        ...this.items[existingIndex],
        ...(updateData as CryptoPriceCache),
        price: updateData.price
          ? new Decimal(updateData.price.toString())
          : this.items[existingIndex].price,
        last_updated: new Date(),
      }
      this.items[existingIndex] = updatedItem
      return updatedItem
    } else {
      const newCrypto: CryptoPriceCache = {
        id: randomUUID(),
        symbol: createData.symbol,
        name: createData.name,
        price: new Decimal(createData.price.toString()),
        last_updated: createData.last_updated
          ? new Date(createData.last_updated)
          : new Date(),
      }
      this.items.push(newCrypto)
      return newCrypto
    }
  }

  async delete(symbol: string): Promise<void> {
    this.items = this.items.filter((item) => item.symbol !== symbol)
  }
}
