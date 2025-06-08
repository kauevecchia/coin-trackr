import { Decimal } from '@prisma/client/runtime/library'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { InMemoryCryptoCacheRepository } from '@/repositories/in-memory/in-memory-crypto-cache-repository'
import { RegisterBuyTransactionUseCase } from './register-buy-transaction'

let transactionsRepository: InMemoryTransactionsRepository
let cryptoPriceCacheRepository: InMemoryCryptoCacheRepository
let sut: RegisterBuyTransactionUseCase

describe('Register Buy Transaction Use Case', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    cryptoPriceCacheRepository = new InMemoryCryptoCacheRepository()
    sut = new RegisterBuyTransactionUseCase(
      transactionsRepository,
      cryptoPriceCacheRepository,
    )
  })

  it('should be able to register buy transaction', async () => {
    await cryptoPriceCacheRepository.create({
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
      transactionDate: new Date(),
    })

    expect(transactionsRepository.items).toHaveLength(1)
    expect(transactionsRepository.items[0]).toMatchObject({
      user_id: 'user-01',
      crypto_symbol: 'crypto-01',
      quantity: new Decimal('01'),
      price_at_transaction: new Decimal('100'),
      transaction_type: 'BUY',
    })
  })
})
