import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { Server } from 'http'
import { Decimal } from '@prisma/client/runtime/library'
import { CryptoCache } from '@/generated/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

let testServer: Server

describe('Get All Fixed Crypto Details (E2E)', () => {
  beforeAll(async () => {
    testServer = app.listen(0)
  })

  beforeEach(async () => {
    await prisma.transaction.deleteMany()
    await prisma.cryptoCache.deleteMany()
    await prisma.user.deleteMany()
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

  it('should be able to get all fixed crypto details', async () => {
    const { token } = await createAndAuthenticateUser(testServer)

    const btc: CryptoCache = {
      id: 'crypto-btc-id',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: new Decimal(70000.5),
      image_url: 'https://example.com/btc_logo.png',
      last_updated: new Date(),
    }
    const eth: CryptoCache = {
      id: 'crypto-eth-id',
      symbol: 'ETH',
      name: 'Ethereum',
      price: new Decimal(4000.25),
      image_url: 'https://example.com/eth_logo.png',
      last_updated: new Date(),
    }

    await prisma.cryptoCache.create({ data: btc })
    await prisma.cryptoCache.create({ data: eth })

    const response = await request(testServer)
      .get('/cryptos/fixed-crypto-details')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toBeDefined()
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body).toHaveLength(2)

    const returnedBtc = response.body.find(
      (c: CryptoCache) => c.symbol === 'BTC',
    )
    expect(returnedBtc).toBeDefined()
    expect(returnedBtc.name).toEqual('Bitcoin')
    expect(returnedBtc.price).toEqual('70000.5')
    expect(returnedBtc.image_url).toEqual('https://example.com/btc_logo.png')
    expect(returnedBtc.last_updated).toBeDefined()

    const returnedEth = response.body.find(
      (c: CryptoCache) => c.symbol === 'ETH',
    )
    expect(returnedEth).toBeDefined()
    expect(returnedEth.name).toEqual('Ethereum')
    expect(returnedEth.price).toEqual('4000.25')
  })

  it('should return an empty array if crypto cache is empty', async () => {
    const { token } = await createAndAuthenticateUser(testServer)

    const response = await request(testServer)
      .get('/cryptos/fixed-crypto-details')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toBeDefined()
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body).toHaveLength(0)
    expect(response.body).toEqual([])
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(testServer)
      .get('/cryptos/fixed-crypto-details')
      .send()

    expect(response.statusCode).toEqual(401)
  })
})
