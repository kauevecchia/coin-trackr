import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryCryptoCacheRepository } from '@/repositories/in-memory/in-memory-crypto-cache-repository'
import { GetAllFixedCryptoDetailsUseCase } from './get-all-fixed-crypto-details'
import { Decimal } from '@prisma/client/runtime/library'
import { CryptoCache } from '@/generated/prisma'

let cryptoCacheRepository: InMemoryCryptoCacheRepository
let sut: GetAllFixedCryptoDetailsUseCase

describe('Get All Fixed Crypto Details Use Case', () => {
  beforeEach(() => {
    cryptoCacheRepository = new InMemoryCryptoCacheRepository()
    sut = new GetAllFixedCryptoDetailsUseCase(cryptoCacheRepository)
  })

  it('should be able to return all fixed crypto details from cache', async () => {
    const btc: CryptoCache = {
      id: 'btc-id-1',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: new Decimal(65000.12),
      image_url: 'https://example.com/btc.png',
      last_updated: new Date('2023-01-01T10:00:00Z'),
    }
    const eth: CryptoCache = {
      id: 'eth-id-1',
      symbol: 'ETH',
      name: 'Ethereum',
      price: new Decimal(3200.55),
      image_url: 'https://example.com/eth.png',
      last_updated: new Date('2023-01-01T11:00:00Z'),
    }
    const ada: CryptoCache = {
      id: 'ada-id-1',
      symbol: 'ADA',
      name: 'Cardano',
      price: new Decimal(0.75),
      image_url: null,
      last_updated: new Date('2023-01-01T12:00:00Z'),
    }

    await cryptoCacheRepository.create(btc)
    await cryptoCacheRepository.create(eth)
    await cryptoCacheRepository.create(ada)

    const result = await sut.execute()

    expect(result).toHaveLength(3)
    const returnedBtc = result.find((c) => c.symbol === 'BTC')
    expect(returnedBtc).toBeDefined()
    expect(returnedBtc?.name).toEqual('Bitcoin')
    expect(returnedBtc?.price.toNumber()).toEqual(65000.12)
    expect(returnedBtc?.image_url).toEqual('https://example.com/btc.png')
    expect(returnedBtc?.last_updated).toBeInstanceOf(Date)

    const returnedAda = result.find((c) => c.symbol === 'ADA')
    expect(returnedAda?.image_url).toBeNull()
  })

  it('should return an empty array if no cryptos are in cache', async () => {
    const result = await sut.execute()

    expect(result).toHaveLength(0)
    expect(result).toEqual([])
  })
})
