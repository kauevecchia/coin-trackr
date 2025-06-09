import { CryptoCacheRepository } from '../crypto-cache-repository'
import { CryptoCache, Prisma } from '@/generated/prisma'
import { randomUUID } from 'node:crypto'
import { Decimal } from '@prisma/client/runtime/library'

export class InMemoryCryptoCacheRepository implements CryptoCacheRepository {
  public items: CryptoCache[] = []

  async findBySymbol(symbol: string): Promise<CryptoCache | null> {
    const crypto = this.items.find((item) => item.symbol === symbol)
    return crypto || null
  }

  async create(
    data: Prisma.CryptoCacheUncheckedCreateInput,
  ): Promise<CryptoCache> {
    const newCrypto: CryptoCache = {
      id: randomUUID(),
      symbol: data.symbol,
      name: data.name,
      price: new Decimal(data.price.toString()),
      image_url: data.image_url || null,
      last_updated: data.last_updated
        ? new Date(data.last_updated)
        : new Date(),
    }

    this.items.push(newCrypto)
    return newCrypto
  }

  async upsert(
    symbol: string,
    data: Prisma.CryptoCacheCreateInput,
  ): Promise<CryptoCache> {
    const existingIndex = this.items.findIndex((item) => item.symbol === symbol)

    if (existingIndex >= 0) {
      const updatedItem = {
        ...this.items[existingIndex],
        ...(data as CryptoCache),
        price: data.price
          ? new Decimal(data.price.toString())
          : this.items[existingIndex].price,
        image_url: data.image_url || null,
        last_updated: new Date(),
      }
      this.items[existingIndex] = updatedItem
      return updatedItem
    } else {
      const newCrypto: CryptoCache = {
        id: randomUUID(),
        symbol: data.symbol,
        name: data.name,
        price: new Decimal(data.price.toString()),
        image_url: data.image_url || null,
        last_updated: data.last_updated
          ? new Date(data.last_updated)
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
