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
      crypto_symbol: data.crypto_symbol,
      crypto_name: data.crypto_name,
      crypto_quantity: new Decimal(data.crypto_quantity.toString()),
      usd_amount: new Decimal(data.usd_amount.toString()),
      price_at_transaction: new Decimal(data.price_at_transaction.toString()),
      transaction_type: data.transaction_type,
      transaction_date: data.transaction_date
        ? new Date(data.transaction_date)
        : new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(transaction)

    return transaction
  }

  async delete(userId: string, transactionId: string) {
    this.items = this.items.filter(
      (item) => item.user_id === userId && item.id !== transactionId,
    )
  }

  async findManyByUserIdAndCryptoSymbol(userId: string, cryptoSymbol: string) {
    const transactions = this.items.filter(
      (item) => item.user_id === userId && item.crypto_symbol === cryptoSymbol,
    )

    return transactions
  }

  async findTransactionsByFilters(
    userId: string,
    filters?: {
      cryptoSymbol?: string
      transactionType?: string
      startDate?: Date
      endDate?: Date
    },
  ) {
    const filteredTransactions = this.items.filter((transaction) => {
      let matches = transaction.user_id === userId

      if (matches && filters?.transactionType) {
        matches = transaction.transaction_type === filters.transactionType
      }
      if (matches && filters?.cryptoSymbol) {
        matches = transaction.crypto_symbol === filters.cryptoSymbol
      }
      if (matches && filters?.startDate) {
        matches = transaction.transaction_date >= filters.startDate
      }
      if (matches && filters?.endDate) {
        matches = transaction.transaction_date <= filters.endDate
      }

      return matches
    })

    filteredTransactions.sort(
      (a, b) => b.transaction_date.getTime() - a.transaction_date.getTime(),
    )

    return filteredTransactions
  }
}
