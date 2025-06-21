import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { Server } from 'http'
import { fetchFixedCryptosFullDetails } from '@/lib/coingecko'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

vi.mock('../../../lib/coingecko', () => ({
  fetchFixedCryptosFullDetails: vi.fn(),
}))

let testServer: Server

describe('Populate Fixed Crypto Cache (E2E)', () => {
  beforeAll(async () => {
    testServer = app.listen(0)
  })

  beforeEach(async () => {
    await prisma.transaction.deleteMany()
    await prisma.cryptoCache.deleteMany()
    await prisma.user.deleteMany()

    vi.mocked(fetchFixedCryptosFullDetails).mockReset()
  })

  afterAll(async () => {
    await new Promise((resolve, reject) => {
      if (testServer) {
        testServer.close((err) => {
          if (err) reject(err)
          resolve(true)
        })
      } else {
        resolve(true)
      }
    })
  })

  it('should be able to populate fixed crypto cache successfully', async () => {
    const { token } = await createAndAuthenticateUser(testServer)

    vi.mocked(fetchFixedCryptosFullDetails).mockResolvedValue([
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image: 'https://assets.coingecko.com/btc.png',
        current_price: 60000,
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        image: 'https://assets.coingecko.com/eth.png',
        current_price: 3000,
      },
    ])

    const response = await request(testServer)
      .post('/cryptos/populate-cache')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)
    expect(response.body).toEqual({})

    const cachedCryptos = await prisma.cryptoCache.findMany()
    expect(cachedCryptos).toHaveLength(2)

    const btcCache = cachedCryptos.find((c) => c.symbol === 'BTC')
    expect(btcCache).toBeDefined()
    expect(btcCache?.name).toEqual('Bitcoin')
    expect(btcCache?.price.toNumber()).toEqual(60000)
    expect(btcCache?.image_url).toEqual('https://assets.coingecko.com/btc.png')
  })

  it('should return 500 if external API call fails', async () => {
    const { token } = await createAndAuthenticateUser(testServer)

    vi.mocked(fetchFixedCryptosFullDetails).mockRejectedValue(
      new Error('CoinGecko API is down'),
    )

    const response = await request(testServer)
      .post('/cryptos/populate-cache')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(500)

    const cachedCryptos = await prisma.cryptoCache.findMany()
    expect(cachedCryptos).toHaveLength(0)
  })

  it('should return 204 even if external API returns empty data', async () => {
    const { token } = await createAndAuthenticateUser(testServer)

    vi.mocked(fetchFixedCryptosFullDetails).mockResolvedValue([])

    const response = await request(testServer)
      .post('/cryptos/populate-cache')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)
    expect(response.body).toEqual({})

    const cachedCryptos = await prisma.cryptoCache.findMany()
    expect(cachedCryptos).toHaveLength(0)
  })
})
