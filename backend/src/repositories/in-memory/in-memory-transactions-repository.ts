// src/repositories/in-memory/in-memory-transactions-repository.ts

import { Decimal } from '@prisma/client/runtime/library'
import { Prisma, Transaction } from '@/generated/prisma'
import { TransactionsRepository } from '../transactions-repository'
import { randomUUID } from 'node:crypto'

type InMemoryTransaction = Transaction

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: InMemoryTransaction[] = []

  async create(
    data: Prisma.TransactionUncheckedCreateInput,
  ): Promise<InMemoryTransaction> {
    const transaction: InMemoryTransaction = {
      id: randomUUID(),
      user_id: data.user_id,
      crypto_id: data.crypto_id,
      crypto_symbol: data.crypto_symbol,
      crypto_name: data.crypto_name,
      quantity: data.quantity,
      unit_price_at_transaction: data.unit_price_at_transaction,
      transaction_type: data.transaction_type,
      transaction_date:
        data.transaction_date instanceof Date
          ? data.transaction_date
          : new Date(data.transaction_date),
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(transaction)

    return transaction
  }
}
