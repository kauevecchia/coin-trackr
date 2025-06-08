import { Prisma, Transaction } from '@/generated/prisma'

export interface TransactionsRepository {
  create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction>
  findManyByUserIdAndCryptoSymbol(
    userId: string,
    cryptoSymbol: string,
  ): Promise<Transaction[]>
}
