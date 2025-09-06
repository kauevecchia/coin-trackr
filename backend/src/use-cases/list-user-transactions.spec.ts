import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { ListUserTransactionsUseCase } from '@/use-cases/list-user-transactions'
import { Decimal } from '@prisma/client/runtime/library'
import { TransactionType } from '@/generated/prisma'

let transactionsRepository: InMemoryTransactionsRepository
let sut: ListUserTransactionsUseCase

const TEST_USER_ID = 'user-test-id'
const BTC_SYMBOL = 'BTC'
const ETH_SYMBOL = 'ETH'
const ADA_SYMBOL = 'ADA'

describe('List User Transactions Use Case', () => {
  beforeEach(async () => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new ListUserTransactionsUseCase(transactionsRepository)

    await transactionsRepository.create({
      user_id: TEST_USER_ID,
      crypto_symbol: BTC_SYMBOL,
      crypto_name: 'Bitcoin',
      quantity: new Decimal(0.5),
      price_at_transaction: new Decimal(30000),
      transaction_type: TransactionType.BUY,
      transaction_date: new Date('2023-01-10T10:00:00Z'),
    })

    await transactionsRepository.create({
      user_id: TEST_USER_ID,
      crypto_symbol: ETH_SYMBOL,
      crypto_name: 'Ethereum',
      quantity: new Decimal(2.0),
      price_at_transaction: new Decimal(2000),
      transaction_type: TransactionType.BUY,
      transaction_date: new Date('2023-02-15T12:00:00Z'),
    })

    await transactionsRepository.create({
      user_id: TEST_USER_ID,
      crypto_symbol: BTC_SYMBOL,
      crypto_name: 'Bitcoin',
      quantity: new Decimal(0.2),
      price_at_transaction: new Decimal(35000),
      transaction_type: TransactionType.SELL,
      transaction_date: new Date('2023-03-01T14:00:00Z'),
    })

    await transactionsRepository.create({
      user_id: TEST_USER_ID,
      crypto_symbol: ADA_SYMBOL,
      crypto_name: 'Cardano',
      quantity: new Decimal(500),
      price_at_transaction: new Decimal(0.5),
      transaction_type: TransactionType.BUY,
      transaction_date: new Date('2023-04-20T08:00:00Z'),
    })

    await transactionsRepository.create({
      user_id: TEST_USER_ID,
      crypto_symbol: ETH_SYMBOL,
      crypto_name: 'Ethereum',
      quantity: new Decimal(0.5),
      price_at_transaction: new Decimal(2500),
      transaction_type: TransactionType.SELL,
      transaction_date: new Date('2023-05-25T16:00:00Z'),
    })

    await transactionsRepository.create({
      user_id: 'another-user-id',
      crypto_symbol: BTC_SYMBOL,
      crypto_name: 'Bitcoin',
      quantity: new Decimal(0.1),
      price_at_transaction: new Decimal(28000),
      transaction_type: TransactionType.BUY,
      transaction_date: new Date('2023-06-01T09:00:00Z'),
    })
  })

  it('should be able to list all transactions for a user without filters', async () => {
    const { transactions } = await sut.execute({
      userId: TEST_USER_ID,
    })

    expect(transactions).toHaveLength(5)
    expect(transactions[0].transaction_type).toEqual(TransactionType.SELL)
  })

  it('should be able to list transactions filtered by BUY type', async () => {
    const { transactions } = await sut.execute({
      userId: TEST_USER_ID,
      filters: {
        transactionType: TransactionType.BUY,
      },
    })

    expect(transactions).toHaveLength(3)
    expect(
      transactions.every((t) => t.transaction_type === TransactionType.BUY),
    ).toBe(true)
  })

  it('should be able to list transactions filtered by SELL type', async () => {
    const { transactions } = await sut.execute({
      userId: TEST_USER_ID,
      filters: {
        transactionType: TransactionType.SELL,
      },
    })

    expect(transactions).toHaveLength(2)
    expect(
      transactions.every((t) => t.transaction_type === TransactionType.SELL),
    ).toBe(true)
  })

  it('should be able to list transactions filtered by crypto symbol', async () => {
    const { transactions } = await sut.execute({
      userId: TEST_USER_ID,
      filters: {
        cryptoSymbol: BTC_SYMBOL,
      },
    })

    expect(transactions).toHaveLength(2)
    expect(transactions.every((t) => t.crypto_symbol === BTC_SYMBOL)).toBe(true)
  })

  it('should be able to list transactions filtered by start date', async () => {
    const { transactions } = await sut.execute({
      userId: TEST_USER_ID,
      filters: {
        startDate: new Date('2023-03-01T00:00:00Z'),
      },
    })

    expect(transactions).toHaveLength(3)
    expect(transactions[0].transaction_date.toISOString()).toBe(
      '2023-05-25T16:00:00.000Z',
    )
    expect(transactions[1].transaction_date.toISOString()).toBe(
      '2023-04-20T08:00:00.000Z',
    )
    expect(transactions[2].transaction_date.toISOString()).toBe(
      '2023-03-01T14:00:00.000Z',
    )
  })

  it('should be able to list transactions filtered by end date', async () => {
    const { transactions } = await sut.execute({
      userId: TEST_USER_ID,
      filters: {
        endDate: new Date('2023-03-01T23:59:59Z'),
      },
    })

    expect(transactions).toHaveLength(3)
    expect(transactions[0].transaction_date.toISOString()).toBe(
      '2023-03-01T14:00:00.000Z',
    )
    expect(transactions[1].transaction_date.toISOString()).toBe(
      '2023-02-15T12:00:00.000Z',
    )
    expect(transactions[2].transaction_date.toISOString()).toBe(
      '2023-01-10T10:00:00.000Z',
    )
  })

  it('should be able to list transactions filtered by date range', async () => {
    const { transactions } = await sut.execute({
      userId: TEST_USER_ID,
      filters: {
        startDate: new Date('2023-02-01T00:00:00Z'),
        endDate: new Date('2023-03-31T23:59:59Z'),
      },
    })

    expect(transactions).toHaveLength(2)
    expect(transactions[0].transaction_date.toISOString()).toBe(
      '2023-03-01T14:00:00.000Z',
    )
    expect(transactions[1].transaction_date.toISOString()).toBe(
      '2023-02-15T12:00:00.000Z',
    )
  })

  it('should be able to list transactions with multiple filters (type and symbol)', async () => {
    const { transactions } = await sut.execute({
      userId: TEST_USER_ID,
      filters: {
        transactionType: TransactionType.BUY,
        cryptoSymbol: BTC_SYMBOL,
      },
    })

    expect(transactions).toHaveLength(1)
    expect(transactions[0].crypto_symbol).toEqual(BTC_SYMBOL)
    expect(transactions[0].transaction_type).toEqual(TransactionType.BUY)
  })

  it('should return an empty array if no transactions are found for the filters', async () => {
    const { transactions } = await sut.execute({
      userId: TEST_USER_ID,
      filters: {
        cryptoSymbol: 'NONEXISTENT',
      },
    })

    expect(transactions).toHaveLength(0)
  })

  it('should not list transactions from other users', async () => {
    const { transactions } = await sut.execute({
      userId: 'another-user-id',
    })

    expect(transactions).toHaveLength(1)
    expect(transactions[0].crypto_symbol).toEqual(BTC_SYMBOL)
    expect(transactions[0].user_id).toEqual('another-user-id')
  })
})
