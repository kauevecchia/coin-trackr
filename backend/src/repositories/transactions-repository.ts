import { Prisma, Transaction } from '@/generated/prisma'

export interface TransactionsRepository {
  create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction>
  findManyByUserIdAndCryptoSymbol(
    userId: string,
    cryptoSymbol: string,
  ): Promise<Transaction[]>
  findTransactionsByFilters(
    userId: string,
    filters?: {
      cryptoSymbol?: string
      transactionType?: string
      startDate?: Date
      endDate?: Date
    },
  ): Promise<Transaction[]>
  delete(userId: string, transactionId: string): Promise<void>
}
