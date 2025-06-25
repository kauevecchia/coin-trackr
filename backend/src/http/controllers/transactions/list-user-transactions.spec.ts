import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { Server } from 'http'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'
import { TransactionType } from '@/generated/prisma'

let testServer: Server

describe('List User Transactions (e2e)', () => {
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

  it('should be able to list all transactions for a user without filters', async () => {
    const { token } = await createAndAuthenticateUser(testServer)
    const user = await prisma.user.findFirst()

    await prisma.transaction.createMany({
      data: [
        {
          user_id: user!.id,
          crypto_symbol: 'BTC',
          crypto_name: 'Bitcoin',
          quantity: new Decimal(0.5),
          price_at_transaction: new Decimal(30000),
          transaction_type: TransactionType.BUY,
          transaction_date: new Date('2023-01-10T10:00:00Z'),
        },
        {
          user_id: user!.id,
          crypto_symbol: 'ETH',
          crypto_name: 'Ethereum',
          quantity: new Decimal(2.0),
          price_at_transaction: new Decimal(2000),
          transaction_type: TransactionType.BUY,
          transaction_date: new Date('2023-02-15T12:00:00Z'),
        },
        {
          user_id: user!.id,
          crypto_symbol: 'BTC',
          crypto_name: 'Bitcoin',
          quantity: new Decimal(0.2),
          price_at_transaction: new Decimal(35000),
          transaction_type: TransactionType.SELL,
          transaction_date: new Date('2023-03-01T14:00:00Z'),
        },
      ],
    })

    const response = await request(testServer)
      .get('/transactions/list')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.transactions).toHaveLength(3)
    expect(response.body.transactions[0].transaction_type).toEqual('SELL')
    expect(response.body.transactions[1].transaction_type).toEqual('BUY')
    expect(response.body.transactions[2].transaction_type).toEqual('BUY')
  })

  it('should be able to list transactions filtered by BUY type', async () => {
    const { token } = await createAndAuthenticateUser(testServer)
    const user = await prisma.user.findFirst()

    await prisma.transaction.createMany({
      data: [
        {
          user_id: user!.id,
          crypto_symbol: 'BTC',
          crypto_name: 'Bitcoin',
          quantity: new Decimal(0.5),
          price_at_transaction: new Decimal(30000),
          transaction_type: TransactionType.BUY,
          transaction_date: new Date('2023-01-10T10:00:00Z'),
        },
        {
          user_id: user!.id,
          crypto_symbol: 'ETH',
          crypto_name: 'Ethereum',
          quantity: new Decimal(2.0),
          price_at_transaction: new Decimal(2000),
          transaction_type: TransactionType.BUY,
          transaction_date: new Date('2023-02-15T12:00:00Z'),
        },
        {
          user_id: user!.id,
          crypto_symbol: 'BTC',
          crypto_name: 'Bitcoin',
          quantity: new Decimal(0.2),
          price_at_transaction: new Decimal(35000),
          transaction_type: TransactionType.SELL,
          transaction_date: new Date('2023-03-01T14:00:00Z'),
        },
      ],
    })

    const response = await request(testServer)
      .get('/transactions/list?transactionType=BUY')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.transactions).toHaveLength(2)
    expect(
      response.body.transactions.every(
        (t: { transaction_type: string }) => t.transaction_type === 'BUY',
      ),
    ).toBe(true)
  })

  it('should be able to list transactions filtered by SELL type', async () => {
    const { token } = await createAndAuthenticateUser(testServer)
    const user = await prisma.user.findFirst()

    await prisma.transaction.createMany({
      data: [
        {
          user_id: user!.id,
          crypto_symbol: 'BTC',
          crypto_name: 'Bitcoin',
          quantity: new Decimal(0.5),
          price_at_transaction: new Decimal(30000),
          transaction_type: TransactionType.BUY,
          transaction_date: new Date('2023-01-10T10:00:00Z'),
        },
        {
          user_id: user!.id,
          crypto_symbol: 'BTC',
          crypto_name: 'Bitcoin',
          quantity: new Decimal(0.2),
          price_at_transaction: new Decimal(35000),
          transaction_type: TransactionType.SELL,
          transaction_date: new Date('2023-03-01T14:00:00Z'),
        },
      ],
    })

    const response = await request(testServer)
      .get('/transactions/list?transactionType=SELL')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.transactions).toHaveLength(1)
    expect(response.body.transactions[0].transaction_type).toEqual('SELL')
  })

  it('should be able to list transactions filtered by crypto symbol', async () => {
    const { token } = await createAndAuthenticateUser(testServer)
    const user = await prisma.user.findFirst()

    await prisma.transaction.createMany({
      data: [
        {
          user_id: user!.id,
          crypto_symbol: 'BTC',
          crypto_name: 'Bitcoin',
          quantity: new Decimal(0.5),
          price_at_transaction: new Decimal(30000),
          transaction_type: TransactionType.BUY,
          transaction_date: new Date('2023-01-10T10:00:00Z'),
        },
        {
          user_id: user!.id,
          crypto_symbol: 'ETH',
          crypto_name: 'Ethereum',
          quantity: new Decimal(2.0),
          price_at_transaction: new Decimal(2000),
          transaction_type: TransactionType.BUY,
          transaction_date: new Date('2023-02-15T12:00:00Z'),
        },
        {
          user_id: user!.id,
          crypto_symbol: 'BTC',
          crypto_name: 'Bitcoin',
          quantity: new Decimal(0.2),
          price_at_transaction: new Decimal(35000),
          transaction_type: TransactionType.SELL,
          transaction_date: new Date('2023-03-01T14:00:00Z'),
        },
      ],
    })

    const response = await request(testServer)
      .get('/transactions/list?cryptoSymbol=BTC')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.transactions).toHaveLength(2)
    expect(
      response.body.transactions.every(
        (t: { crypto_symbol: string }) => t.crypto_symbol === 'BTC',
      ),
    ).toBe(true)
  })

  it('should be able to list transactions filtered by start date', async () => {
    const { token } = await createAndAuthenticateUser(testServer)
    const user = await prisma.user.findFirst()

    await prisma.transaction.createMany({
      data: [
        {
          user_id: user!.id,
          crypto_symbol: 'BTC',
          crypto_name: 'Bitcoin',
          quantity: new Decimal(0.5),
          price_at_transaction: new Decimal(30000),
          transaction_type: TransactionType.BUY,
          transaction_date: new Date('2023-01-10T10:00:00Z'),
        },
        {
          user_id: user!.id,
          crypto_symbol: 'ETH',
          crypto_name: 'Ethereum',
          quantity: new Decimal(2.0),
          price_at_transaction: new Decimal(2000),
          transaction_type: TransactionType.BUY,
          transaction_date: new Date('2023-02-15T12:00:00Z'),
        },
        {
          user_id: user!.id,
          crypto_symbol: 'BTC',
          crypto_name: 'Bitcoin',
          quantity: new Decimal(0.2),
          price_at_transaction: new Decimal(35000),
          transaction_type: TransactionType.SELL,
          transaction_date: new Date('2023-03-01T14:00:00Z'),
        },
      ],
    })

    const response = await request(testServer)
      .get('/transactions/list?startDate=2023-02-01T00:00:00Z')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.transactions).toHaveLength(2)
    expect(response.body.transactions[0].transaction_date).toBe(
      '2023-03-01T14:00:00.000Z',
    )
    expect(response.body.transactions[1].transaction_date).toBe(
      '2023-02-15T12:00:00.000Z',
    )
  })

  it('should be able to list transactions filtered by end date', async () => {
    const { token } = await createAndAuthenticateUser(testServer)
    const user = await prisma.user.findFirst()

    await prisma.transaction.createMany({
      data: [
        {
          user_id: user!.id,
          crypto_symbol: 'BTC',
          crypto_name: 'Bitcoin',
          quantity: new Decimal(0.5),
          price_at_transaction: new Decimal(30000),
          transaction_type: TransactionType.BUY,
          transaction_date: new Date('2023-01-10T10:00:00Z'),
        },
        {
          user_id: user!.id,
          crypto_symbol: 'ETH',
          crypto_name: 'Ethereum',
          quantity: new Decimal(2.0),
          price_at_transaction: new Decimal(2000),
          transaction_type: TransactionType.BUY,
          transaction_date: new Date('2023-02-15T12:00:00Z'),
        },
        {
          user_id: user!.id,
          crypto_symbol: 'BTC',
          crypto_name: 'Bitcoin',
          quantity: new Decimal(0.2),
          price_at_transaction: new Decimal(35000),
          transaction_type: TransactionType.SELL,
          transaction_date: new Date('2023-03-01T14:00:00Z'),
        },
      ],
    })

    const response = await request(testServer)
      .get('/transactions/list?endDate=2023-02-15T23:59:59Z')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.transactions).toHaveLength(2)
    expect(response.body.transactions[0].transaction_date).toBe(
      '2023-02-15T12:00:00.000Z',
    )
    expect(response.body.transactions[1].transaction_date).toBe(
      '2023-01-10T10:00:00.000Z',
    )
  })

  it('should be able to list transactions with multiple filters', async () => {
    const { token } = await createAndAuthenticateUser(testServer)
    const user = await prisma.user.findFirst()

    await prisma.transaction.createMany({
      data: [
        {
          user_id: user!.id,
          crypto_symbol: 'BTC',
          crypto_name: 'Bitcoin',
          quantity: new Decimal(0.5),
          price_at_transaction: new Decimal(30000),
          transaction_type: TransactionType.BUY,
          transaction_date: new Date('2023-01-10T10:00:00Z'),
        },
        {
          user_id: user!.id,
          crypto_symbol: 'ETH',
          crypto_name: 'Ethereum',
          quantity: new Decimal(2.0),
          price_at_transaction: new Decimal(2000),
          transaction_type: TransactionType.BUY,
          transaction_date: new Date('2023-02-15T12:00:00Z'),
        },
        {
          user_id: user!.id,
          crypto_symbol: 'BTC',
          crypto_name: 'Bitcoin',
          quantity: new Decimal(0.2),
          price_at_transaction: new Decimal(35000),
          transaction_type: TransactionType.SELL,
          transaction_date: new Date('2023-03-01T14:00:00Z'),
        },
      ],
    })

    const response = await request(testServer)
      .get('/transactions/list?transactionType=BUY&cryptoSymbol=BTC')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.transactions).toHaveLength(1)
    expect(response.body.transactions[0].crypto_symbol).toEqual('BTC')
    expect(response.body.transactions[0].transaction_type).toEqual('BUY')
  })

  it('should return an empty array if no transactions are found', async () => {
    const { token } = await createAndAuthenticateUser(testServer)

    const response = await request(testServer)
      .get('/transactions/list')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.transactions).toHaveLength(0)
  })

  it('should not be able to list transactions without authentication', async () => {
    const response = await request(testServer).get('/transactions/list').send()

    expect(response.statusCode).toEqual(401)
    expect(response.body).toEqual({ message: 'Token not provided.' })
  })

  it('should not list transactions from other users', async () => {
    const { token } = await createAndAuthenticateUser(testServer)
    const user = await prisma.user.findFirst()

    const anotherUser = await prisma.user.create({
      data: {
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password_hash: 'hashed_password',
      },
    })

    await prisma.transaction.createMany({
      data: [
        {
          user_id: user!.id,
          crypto_symbol: 'BTC',
          crypto_name: 'Bitcoin',
          quantity: new Decimal(0.5),
          price_at_transaction: new Decimal(30000),
          transaction_type: TransactionType.BUY,
          transaction_date: new Date('2023-01-10T10:00:00Z'),
        },
        {
          user_id: anotherUser.id,
          crypto_symbol: 'ETH',
          crypto_name: 'Ethereum',
          quantity: new Decimal(2.0),
          price_at_transaction: new Decimal(2000),
          transaction_type: TransactionType.BUY,
          transaction_date: new Date('2023-02-15T12:00:00Z'),
        },
      ],
    })

    const response = await request(testServer)
      .get('/transactions/list')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.transactions).toHaveLength(1)
    expect(response.body.transactions[0].user_id).toEqual(user!.id)
  })
})
