import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { Server } from 'http'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'
import { TransactionType } from '@/generated/prisma'

let testServer: Server

describe('Register Sell Transaction (e2e)', () => {
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

  it('should be able to register a sell transaction', async () => {
    const { token } = await createAndAuthenticateUser(testServer)
    const user = await prisma.user.findFirst()

    await prisma.cryptoCache.create({
      data: {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 60000,
        image_url: 'https://assets.coingecko.com/btc.png',
        last_updated: new Date(),
      },
    })

    await prisma.transaction.create({
      data: {
        user_id: user!.id,
        crypto_symbol: 'BTC',
        crypto_name: 'Bitcoin',
        quantity: new Decimal(1.0),
        price_at_transaction: new Decimal(50000),
        transaction_type: TransactionType.BUY,
        transaction_date: new Date('2023-01-01T10:00:00Z'),
      },
    })

    const response = await request(testServer)
      .post('/transactions/sell')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cryptoSymbol: 'BTC',
        quantity: 0.5,
        unitPriceAtTransaction: 60000,
        transactionDate: new Date('2023-02-01T12:00:00Z'),
      })

    expect(response.statusCode).toEqual(201)

    const transactions = await prisma.transaction.findMany({
      where: { user_id: user!.id },
      orderBy: { transaction_date: 'desc' },
    })

    expect(transactions).toHaveLength(2)
    expect(transactions[0].transaction_type).toEqual(TransactionType.SELL)
    expect(transactions[0].quantity.toNumber()).toEqual(0.5)
    expect(transactions[0].price_at_transaction.toNumber()).toEqual(60000)
  })

  it('should not be able to register a sell transaction without authentication', async () => {
    await createAndAuthenticateUser(testServer)
    const user = await prisma.user.findFirst()

    await prisma.cryptoCache.create({
      data: {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 60000,
        image_url: 'https://assets.coingecko.com/btc.png',
        last_updated: new Date(),
      },
    })

    await prisma.transaction.create({
      data: {
        user_id: user!.id,
        crypto_symbol: 'BTC',
        crypto_name: 'Bitcoin',
        quantity: new Decimal(1.0),
        price_at_transaction: new Decimal(50000),
        transaction_type: TransactionType.BUY,
        transaction_date: new Date('2023-01-01T10:00:00Z'),
      },
    })

    const response = await request(testServer)
      .post('/transactions/sell')
      .send({
        cryptoSymbol: 'BTC',
        quantity: 0.5,
        unitPriceAtTransaction: 60000,
        transactionDate: new Date('2023-02-01T12:00:00Z'),
      })

    expect(response.statusCode).toEqual(401)
    expect(response.body).toEqual({ message: 'Token not provided.' })
  })

  it('should not be able to register a sell transaction for crypto not in cache', async () => {
    const { token } = await createAndAuthenticateUser(testServer)
    const user = await prisma.user.findFirst()

    await prisma.transaction.create({
      data: {
        user_id: user!.id,
        crypto_symbol: 'BTC',
        crypto_name: 'Bitcoin',
        quantity: new Decimal(1.0),
        price_at_transaction: new Decimal(50000),
        transaction_type: TransactionType.BUY,
        transaction_date: new Date('2023-01-01T10:00:00Z'),
      },
    })

    const response = await request(testServer)
      .post('/transactions/sell')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cryptoSymbol: 'ETH',
        quantity: 0.5,
        unitPriceAtTransaction: 3000,
        transactionDate: new Date('2023-02-01T12:00:00Z'),
      })

    expect(response.statusCode).toEqual(404)
    expect(response.body).toEqual({ message: 'Crypto not found' })
  })

  it('should not be able to register a sell transaction with insufficient balance', async () => {
    const { token } = await createAndAuthenticateUser(testServer)
    const user = await prisma.user.findFirst()

    await prisma.cryptoCache.create({
      data: {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 60000,
        image_url: 'https://assets.coingecko.com/btc.png',
        last_updated: new Date(),
      },
    })

    await prisma.transaction.create({
      data: {
        user_id: user!.id,
        crypto_symbol: 'BTC',
        crypto_name: 'Bitcoin',
        quantity: new Decimal(0.5),
        price_at_transaction: new Decimal(50000),
        transaction_type: TransactionType.BUY,
        transaction_date: new Date('2023-01-01T10:00:00Z'),
      },
    })

    const response = await request(testServer)
      .post('/transactions/sell')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cryptoSymbol: 'BTC',
        quantity: 1.0,
        unitPriceAtTransaction: 60000,
        transactionDate: new Date('2023-02-01T12:00:00Z'),
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual({
      message: 'Insufficient funds for this crypto',
    })
  })

  it('should be able to sell the exact available balance', async () => {
    const { token } = await createAndAuthenticateUser(testServer)
    const user = await prisma.user.findFirst()

    await prisma.cryptoCache.create({
      data: {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 60000,
        image_url: 'https://assets.coingecko.com/btc.png',
        last_updated: new Date(),
      },
    })

    await prisma.transaction.create({
      data: {
        user_id: user!.id,
        crypto_symbol: 'BTC',
        crypto_name: 'Bitcoin',
        quantity: new Decimal(1.0),
        price_at_transaction: new Decimal(50000),
        transaction_type: TransactionType.BUY,
        transaction_date: new Date('2023-01-01T10:00:00Z'),
      },
    })

    const response = await request(testServer)
      .post('/transactions/sell')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cryptoSymbol: 'BTC',
        quantity: 1.0,
        unitPriceAtTransaction: 60000,
        transactionDate: new Date('2023-02-01T12:00:00Z'),
      })

    expect(response.statusCode).toEqual(201)

    const transactions = await prisma.transaction.findMany({
      where: { user_id: user!.id },
      orderBy: { transaction_date: 'desc' },
    })

    expect(transactions).toHaveLength(2)
    expect(transactions[0].transaction_type).toEqual(TransactionType.SELL)
    expect(transactions[0].quantity.toNumber()).toEqual(1.0)
  })

  it('should handle complex balance calculations with multiple transactions', async () => {
    const { token } = await createAndAuthenticateUser(testServer)
    const user = await prisma.user.findFirst()

    await prisma.cryptoCache.create({
      data: {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 60000,
        image_url: 'https://assets.coingecko.com/btc.png',
        last_updated: new Date(),
      },
    })

    await prisma.transaction.createMany({
      data: [
        {
          user_id: user!.id,
          crypto_symbol: 'BTC',
          crypto_name: 'Bitcoin',
          quantity: new Decimal(2.0),
          price_at_transaction: new Decimal(50000),
          transaction_type: TransactionType.BUY,
          transaction_date: new Date('2023-01-01T10:00:00Z'),
        },
        {
          user_id: user!.id,
          crypto_symbol: 'BTC',
          crypto_name: 'Bitcoin',
          quantity: new Decimal(0.5),
          price_at_transaction: new Decimal(55000),
          transaction_type: TransactionType.SELL,
          transaction_date: new Date('2023-01-15T12:00:00Z'),
        },
        {
          user_id: user!.id,
          crypto_symbol: 'BTC',
          crypto_name: 'Bitcoin',
          quantity: new Decimal(1.0),
          price_at_transaction: new Decimal(52000),
          transaction_type: TransactionType.BUY,
          transaction_date: new Date('2023-02-01T14:00:00Z'),
        },
      ],
    })

    const response = await request(testServer)
      .post('/transactions/sell')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cryptoSymbol: 'BTC',
        quantity: 1.5,
        unitPriceAtTransaction: 60000,
        transactionDate: new Date('2023-03-01T16:00:00Z'),
      })

    expect(response.statusCode).toEqual(201)

    const transactions = await prisma.transaction.findMany({
      where: { user_id: user!.id },
      orderBy: { transaction_date: 'desc' },
    })

    expect(transactions).toHaveLength(4)
    expect(transactions[0].transaction_type).toEqual(TransactionType.SELL)
    expect(transactions[0].quantity.toNumber()).toEqual(1.5)
  })

  it('should not be able to sell if user has no transactions for the crypto', async () => {
    const { token } = await createAndAuthenticateUser(testServer)

    await prisma.cryptoCache.create({
      data: {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 60000,
        image_url: 'https://assets.coingecko.com/btc.png',
        last_updated: new Date(),
      },
    })

    const response = await request(testServer)
      .post('/transactions/sell')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cryptoSymbol: 'BTC',
        quantity: 0.1,
        unitPriceAtTransaction: 60000,
        transactionDate: new Date('2023-02-01T12:00:00Z'),
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual({
      message: 'Insufficient funds for this crypto',
    })
  })

  it('should validate required fields', async () => {
    const { token } = await createAndAuthenticateUser(testServer)

    const response = await request(testServer)
      .post('/transactions/sell')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual({
      message: 'Validation error.',
      issues: {
        _errors: [],
        cryptoSymbol: {
          _errors: ['Required'],
        },
        quantity: {
          _errors: ['Expected number, received nan'],
        },
        unitPriceAtTransaction: {
          _errors: ['Expected number, received nan'],
        },
        transactionDate: {
          _errors: ['Invalid date'],
        },
      },
    })
  })

  it('should validate numeric fields', async () => {
    const { token } = await createAndAuthenticateUser(testServer)

    const response = await request(testServer)
      .post('/transactions/sell')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cryptoSymbol: 'BTC',
        quantity: 'invalid',
        unitPriceAtTransaction: 'invalid',
        transactionDate: 'invalid',
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body.message).toEqual('Validation error.')
  })
})
