import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { Server } from 'http'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'
import { TransactionType } from '@/generated/prisma'

let testServer: Server

describe('Delete Transaction (e2e)', () => {
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

  it('should be able to delete a transaction', async () => {
    const { token } = await createAndAuthenticateUser(testServer)

    const transaction = await prisma.transaction.create({
      data: {
        user_id: (await prisma.user.findFirst())!.id,
        crypto_symbol: 'BTC',
        crypto_name: 'Bitcoin',
        quantity: new Decimal(0.5),
        price_at_transaction: new Decimal(30000),
        transaction_type: TransactionType.BUY,
        transaction_date: new Date(),
      },
    })

    const transactionBeforeDelete = await prisma.transaction.findUnique({
      where: { id: transaction.id },
    })
    expect(transactionBeforeDelete).toBeTruthy()

    const response = await request(testServer)
      .post('/transactions/delete')
      .set('Authorization', `Bearer ${token}`)
      .send({
        transactionId: transaction.id,
      })

    expect(response.statusCode).toEqual(201)

    const transactionAfterDelete = await prisma.transaction.findUnique({
      where: { id: transaction.id },
    })
    expect(transactionAfterDelete).toBeNull()
  })

  it('should not be able to delete a transaction without authentication', async () => {
    await createAndAuthenticateUser(testServer)

    const transaction = await prisma.transaction.create({
      data: {
        user_id: (await prisma.user.findFirst())!.id,
        crypto_symbol: 'BTC',
        crypto_name: 'Bitcoin',
        quantity: new Decimal(0.5),
        price_at_transaction: new Decimal(30000),
        transaction_type: TransactionType.BUY,
        transaction_date: new Date(),
      },
    })

    const response = await request(testServer)
      .post('/transactions/delete')
      .send({
        transactionId: transaction.id,
      })

    expect(response.statusCode).toEqual(401)
    expect(response.body).toEqual({ message: 'Token not provided.' })

    const transactionAfterAttempt = await prisma.transaction.findUnique({
      where: { id: transaction.id },
    })
    expect(transactionAfterAttempt).toBeTruthy()
  })

  it('should not be able to delete a transaction from another user', async () => {
    const { token } = await createAndAuthenticateUser(testServer)

    const anotherUser = await prisma.user.create({
      data: {
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password_hash: 'hashed_password',
      },
    })

    const transaction = await prisma.transaction.create({
      data: {
        user_id: anotherUser.id,
        crypto_symbol: 'BTC',
        crypto_name: 'Bitcoin',
        quantity: new Decimal(0.5),
        price_at_transaction: new Decimal(30000),
        transaction_type: TransactionType.BUY,
        transaction_date: new Date(),
      },
    })

    const response = await request(testServer)
      .post('/transactions/delete')
      .set('Authorization', `Bearer ${token}`)
      .send({
        transactionId: transaction.id,
      })

    expect(response.statusCode).toEqual(404)
    expect(response.body).toEqual({ message: 'Transaction not found' })

    const transactionAfterAttempt = await prisma.transaction.findUnique({
      where: { id: transaction.id },
    })
    expect(transactionAfterAttempt).toBeTruthy()
  })

  it('should not be able to delete a non-existent transaction', async () => {
    const { token } = await createAndAuthenticateUser(testServer)

    const response = await request(testServer)
      .post('/transactions/delete')
      .set('Authorization', `Bearer ${token}`)
      .send({
        transactionId: 'non-existent-transaction-id',
      })

    expect(response.statusCode).toEqual(404)
    expect(response.body).toEqual({ message: 'Transaction not found' })
  })

  it('should validate required fields', async () => {
    const { token } = await createAndAuthenticateUser(testServer)

    const response = await request(testServer)
      .post('/transactions/delete')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual({
      message: 'Validation error.',
      issues: {
        _errors: [],
        transactionId: {
          _errors: ['Required'],
        },
      },
    })
  })
})
