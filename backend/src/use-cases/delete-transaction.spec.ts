import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/in-memory-transactions-repository'
import { DeleteTransactionUseCase } from './delete-transaction'
import { Decimal } from '@prisma/client/runtime/library'
import { TransactionType } from '@/generated/prisma'

let transactionsRepository: InMemoryTransactionsRepository
let sut: DeleteTransactionUseCase

const TEST_USER_ID = 'user-to-delete-id'
const TEST_CRYPTO_SYMBOL = 'crypto-01'
const TEST_CRYPTO_NAME = 'Crypto 01'

describe('Delete Transaction Use Case', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = new DeleteTransactionUseCase(transactionsRepository)
  })

  it('should be able to delete a transaction', async () => {
    const createdTransaction = await transactionsRepository.create({
      user_id: TEST_USER_ID,
      crypto_symbol: TEST_CRYPTO_SYMBOL,
      crypto_name: TEST_CRYPTO_NAME,
      quantity: new Decimal(0.5),
      price_at_transaction: new Decimal(30000),
      transaction_type: TransactionType.BUY,
      transaction_date: new Date(),
    })

    expect(transactionsRepository.items).toHaveLength(1)

    await sut.execute({
      userId: TEST_USER_ID,
      transactionId: createdTransaction.id,
    })

    expect(transactionsRepository.items).toHaveLength(0)
  })
})
