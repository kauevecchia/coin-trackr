import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PopulateFixedCryptoCacheUseCase } from './populate-fixed-crypto-cache'
import { InMemoryCryptoCacheRepository } from '@/repositories/in-memory/in-memory-crypto-cache-repository'
import { fetchFixedCryptosFullDetails } from '@/lib/coingecko'
import { Decimal } from '@prisma/client/runtime/library'

vi.mock('@/lib/coingecko', () => ({
  fetchFixedCryptosFullDetails: vi.fn(),
}))

let cryptoCacheRepository: InMemoryCryptoCacheRepository
let sut: PopulateFixedCryptoCacheUseCase

describe('Populate Fixed Crypto Cache Use Case', () => {
  beforeEach(() => {
    cryptoCacheRepository = new InMemoryCryptoCacheRepository()
    sut = new PopulateFixedCryptoCacheUseCase(cryptoCacheRepository)

    vi.mocked(fetchFixedCryptosFullDetails).mockReset()
  })

  it('should be able to populate/update crypto cache successfully', async () => {
    vi.mocked(fetchFixedCryptosFullDetails).mockResolvedValue([
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image: 'https://assets.coingecko.com/btc.png',
        current_price: 60000.123456789,
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        image: 'https://assets.coingecko.com/eth.png',
        current_price: 3000.5,
      },
    ])

    await sut.execute()

    expect(fetchFixedCryptosFullDetails).toHaveBeenCalledTimes(1)

    expect(cryptoCacheRepository.items).toHaveLength(2)

    const btc = cryptoCacheRepository.items.find((c) => c.symbol === 'BTC')
    expect(btc).toBeDefined()
    expect(btc?.name).toEqual('Bitcoin')
    expect(btc?.price.toNumber()).toEqual(60000.123456789)
    expect(btc?.image_url).toEqual('https://assets.coingecko.com/btc.png')
    expect(btc?.last_updated).toBeInstanceOf(Date)

    const eth = cryptoCacheRepository.items.find((c) => c.symbol === 'ETH')
    expect(eth).toBeDefined()
    expect(eth?.name).toEqual('Ethereum')
    expect(eth?.price.toNumber()).toEqual(3000.5)
    expect(eth?.image_url).toEqual('https://assets.coingecko.com/eth.png')
    expect(eth?.last_updated).toBeInstanceOf(Date)
  })

  it('should update existing crypto prices and data in cache', async () => {
    await cryptoCacheRepository.create({
      symbol: 'BTC',
      name: 'Old Bitcoin Name',
      price: new Decimal(50000),
      image_url: 'old_btc_image.png',
      last_updated: new Date('2023-01-01T00:00:00Z'),
    })

    vi.mocked(fetchFixedCryptosFullDetails).mockResolvedValue([
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'New Bitcoin Name',
        current_price: 65000,
        image: 'new_btc_image.png',
      },
    ])

    await sut.execute()

    expect(fetchFixedCryptosFullDetails).toHaveBeenCalledTimes(1)
    expect(cryptoCacheRepository.items).toHaveLength(1)

    const btc = cryptoCacheRepository.items.find((c) => c.symbol === 'BTC')
    expect(btc).toBeDefined()
    expect(btc?.name).toEqual('New Bitcoin Name')
    expect(btc?.price.toNumber()).toEqual(65000)
    expect(btc?.image_url).toEqual('new_btc_image.png')
    expect(btc?.last_updated.getTime()).toBeGreaterThan(
      new Date('2023-01-01T00:00:00Z').getTime(),
    )
  })

  it('should not update cache if API returns no data', async () => {
    vi.mocked(fetchFixedCryptosFullDetails).mockResolvedValue([])

    await cryptoCacheRepository.create({
      symbol: 'LTC',
      name: 'Litecoin',
      price: new Decimal(100),
      last_updated: new Date(),
      image_url: null,
    })

    await sut.execute()

    expect(fetchFixedCryptosFullDetails).toHaveBeenCalledTimes(1)
    expect(cryptoCacheRepository.items).toHaveLength(1)
    expect(cryptoCacheRepository.items[0].symbol).toEqual('LTC')
  })

  it('should throw an error if external API call fails', async () => {
    vi.mocked(fetchFixedCryptosFullDetails).mockRejectedValue(
      new Error('Network error during API call.'),
    )

    await expect(sut.execute()).rejects.toThrow(
      'Failed to fetch crypto details from external API for cache population.',
    )
    expect(fetchFixedCryptosFullDetails).toHaveBeenCalledTimes(1)
    expect(cryptoCacheRepository.items).toHaveLength(0)
  })

  it('should handle null/undefined prices from API as Decimal(0)', async () => {
    vi.mocked(fetchFixedCryptosFullDetails).mockResolvedValue([
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image: 'https://assets.coingecko.com/btc.png',
        current_price: undefined,
      },
    ])

    await sut.execute()

    const btc = cryptoCacheRepository.items.find((c) => c.symbol === 'BTC')
    expect(btc?.price.toNumber()).toEqual(0)
  })

  it('should handle null/undefined image URLs from API', async () => {
    vi.mocked(fetchFixedCryptosFullDetails).mockResolvedValue([
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        image: undefined,
        current_price: 3000,
      },
    ])

    await sut.execute()

    const eth = cryptoCacheRepository.items.find((c) => c.symbol === 'ETH')
    expect(eth?.image_url).toBeNull()
  })
})
