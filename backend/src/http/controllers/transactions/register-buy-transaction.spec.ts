import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { Server } from 'http'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

let testServer: Server

describe('Register Buy Transaction (e2e)', () => {
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

  it('should be able to register a buy transaction', async () => {
    const { token } = await createAndAuthenticateUser(testServer)

    const response = await request(testServer)
      .post('/transactions/register-buy-transaction')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: 'user-01',
        cryptoSymbol: 'BTC',
        quantity: 1,
        unitPriceAtTransaction: 10000,
        transactionDate: new Date(),
      })

    expect(response.statusCode).toEqual(201)
  })
})
