import { describe, it, expect, beforeEach } from 'vitest'
import { RegisterSellTransactionUseCase } from './register-sell-transaction'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { InMemoryCryptoCacheRepository } from '@/repositories/in-memory/in-memory-crypto-cache-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Decimal } from '@prisma/client/runtime/library'
import { TransactionType } from '@/generated/prisma'
import { InsufficientFundsError } from './errors/insufFicient-funds-error'

let transactionsRepository: InMemoryTransactionsRepository
let cryptoPriceCacheRepository: InMemoryCryptoCacheRepository
let sut: RegisterSellTransactionUseCase

const TEST_USER_ID = 'user-123'
const TEST_CRYPTO_SYMBOL = 'BTC'
const TEST_CRYPTO_NAME = 'Bitcoin'

describe('Register Sell Transaction Use Case', () => {
  beforeEach(async () => {
    transactionsRepository = new InMemoryTransactionsRepository()
    cryptoPriceCacheRepository = new InMemoryCryptoCacheRepository()
    sut = new RegisterSellTransactionUseCase(
      transactionsRepository,
      cryptoPriceCacheRepository,
    )

    await cryptoPriceCacheRepository.create({
      symbol: TEST_CRYPTO_SYMBOL,
      name: TEST_CRYPTO_NAME,
      price: new Decimal(30000),
    })
  })

  it('should be able to register a sell transaction with sufficient balance', async () => {
    await transactionsRepository.create({
      user_id: TEST_USER_ID,
      crypto_symbol: TEST_CRYPTO_SYMBOL,
      crypto_name: TEST_CRYPTO_NAME,
      quantity: new Decimal(1.0),
      price_at_transaction: new Decimal(25000),
      transaction_type: TransactionType.BUY,
      transaction_date: new Date(),
    })

    const sellQuantity = new Decimal(0.5)

    const { transaction } = await sut.execute({
      userId: TEST_USER_ID,
      cryptoSymbol: TEST_CRYPTO_SYMBOL,
      quantity: sellQuantity,
      unitPriceAtTransaction: new Decimal(30000),
      transactionDate: new Date(),
    })

    expect(transaction.id).toEqual(expect.any(String))
    expect(transaction.transaction_type).toEqual(TransactionType.SELL)
    expect(transaction.quantity.toNumber()).toEqual(sellQuantity.toNumber())

    const remainingTransactions =
      await transactionsRepository.findManyByUserIdAndCryptoSymbol(
        TEST_USER_ID,
        TEST_CRYPTO_SYMBOL,
      )
    let finalBalance = new Decimal(0)
    for (const tx of remainingTransactions) {
      if (tx.transaction_type === TransactionType.BUY) {
        finalBalance = finalBalance.plus(tx.quantity)
      } else {
        finalBalance = finalBalance.minus(tx.quantity)
      }
    }
    expect(finalBalance.toNumber()).toEqual(0.5)
  })

  it('should not be able to register a sell transaction if crypto not found in cache', async () => {
    await expect(() =>
      sut.execute({
        userId: TEST_USER_ID,
        cryptoSymbol: 'XYZ',
        quantity: new Decimal(0.1),
        unitPriceAtTransaction: new Decimal(100),
        transactionDate: new Date(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to register a sell transaction with insufficient balance', async () => {
    await transactionsRepository.create({
      user_id: TEST_USER_ID,
      crypto_symbol: TEST_CRYPTO_SYMBOL,
      crypto_name: TEST_CRYPTO_NAME,
      quantity: new Decimal(0.1),
      price_at_transaction: new Decimal(25000),
      transaction_type: TransactionType.BUY,
      transaction_date: new Date(),
    })

    const sellQuantity = new Decimal(0.5)

    await expect(() =>
      sut.execute({
        userId: TEST_USER_ID,
        cryptoSymbol: TEST_CRYPTO_SYMBOL,
        quantity: sellQuantity,
        unitPriceAtTransaction: new Decimal(30000),
        transactionDate: new Date(),
      }),
    ).rejects.toBeInstanceOf(InsufficientFundsError)
  })

  it('should not be able to sell if user has no transactions for the crypto (balance 0)', async () => {
    const sellQuantity = new Decimal(0.1)

    await expect(() =>
      sut.execute({
        userId: TEST_USER_ID,
        cryptoSymbol: TEST_CRYPTO_SYMBOL,
        quantity: sellQuantity,
        unitPriceAtTransaction: new Decimal(30000),
        transactionDate: new Date(),
      }),
    ).rejects.toBeInstanceOf(InsufficientFundsError)
  })

  it('should be able to sell the exact available balance', async () => {
    await transactionsRepository.create({
      user_id: TEST_USER_ID,
      crypto_symbol: TEST_CRYPTO_SYMBOL,
      crypto_name: TEST_CRYPTO_NAME,
      quantity: new Decimal(1.0),
      price_at_transaction: new Decimal(25000),
      transaction_type: TransactionType.BUY,
      transaction_date: new Date(),
    })

    const sellQuantity = new Decimal(1.0)

    const { transaction } = await sut.execute({
      userId: TEST_USER_ID,
      cryptoSymbol: TEST_CRYPTO_SYMBOL,
      quantity: sellQuantity,
      unitPriceAtTransaction: new Decimal(30000),
      transactionDate: new Date(),
    })

    expect(transaction.id).toEqual(expect.any(String))
    expect(transaction.transaction_type).toEqual(TransactionType.SELL)
    expect(transaction.quantity.toNumber()).toEqual(sellQuantity.toNumber())

    const remainingTransactions =
      await transactionsRepository.findManyByUserIdAndCryptoSymbol(
        TEST_USER_ID,
        TEST_CRYPTO_SYMBOL,
      )
    let finalBalance = new Decimal(0)
    for (const tx of remainingTransactions) {
      if (tx.transaction_type === TransactionType.BUY) {
        finalBalance = finalBalance.plus(tx.quantity)
      } else {
        finalBalance = finalBalance.minus(tx.quantity)
      }
    }
    expect(finalBalance.toNumber()).toEqual(0)
  })
})
