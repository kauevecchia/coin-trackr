import { Decimal } from '@prisma/client/runtime/library'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { InMemoryCryptoCacheRepository } from '@/repositories/in-memory/in-memory-crypto-cache-repository'
import { CreateTransactionUseCase } from './create-transaction'

let transactionsRepository: InMemoryTransactionsRepository
let cryptoCacheRepository: InMemoryCryptoCacheRepository
let sut: CreateTransactionUseCase

describe('Create Transaction Use Case', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    cryptoCacheRepository = new InMemoryCryptoCacheRepository()
    sut = new CreateTransactionUseCase(
      transactionsRepository,
      cryptoCacheRepository,
    )
  })

  it('should be able to create transaction', async () => {
    await cryptoCacheRepository.create({
      symbol: 'crypto-01',
      name: 'Crypto 01',
      price: new Decimal('100'),
      last_updated: new Date(),
    })

    await sut.execute({
      userId: 'user-01',
      cryptoId: 'crypto-01',
      quantity: new Decimal('01'),
      unitPriceAtTransaction: new Decimal('100'),
      transactionType: 'BUY',
      transactionDate: new Date('2025-01-01'),
    })

    expect(transactionsRepository.items).toHaveLength(1)
    expect(transactionsRepository.items[0]).toMatchObject({
      user_id: 'user-01',
      crypto_symbol: 'crypto-01',
      quantity: new Decimal('01'),
      price_at_transaction: new Decimal('100'),
      transaction_type: 'BUY',
      transaction_date: new Date('2025-01-01'),
    })
  })
})
