import { prisma } from '@/lib/prisma'
import { Prisma, TransactionType } from '@/generated/prisma'
import { TransactionsRepository } from '../transactions-repository'

export class PrismaTransactionsRepository implements TransactionsRepository {
  async create(data: Prisma.TransactionUncheckedCreateInput) {
    const transaction = await prisma.transaction.create({
      data,
    })

    return transaction
  }

  async delete(userId: string, transactionId: string) {
    await prisma.transaction.delete({
      where: {
        user_id: userId,
        id: transactionId,
      },
    })
  }

  async findManyByUserIdAndCryptoSymbol(userId: string, cryptoSymbol: string) {
    const transactions = await prisma.transaction.findMany({
      where: {
        user_id: userId,
        crypto_symbol: cryptoSymbol,
      },
    })

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
    const whereClause: Prisma.TransactionWhereInput = {
      user_id: userId,
    }

    if (filters?.transactionType) {
      whereClause.transaction_type = filters.transactionType as TransactionType
    }
    if (filters?.cryptoSymbol) {
      whereClause.crypto_symbol = filters.cryptoSymbol
    }
    if (filters?.startDate || filters?.endDate) {
      whereClause.transaction_date = {}

      if (filters.startDate) {
        whereClause.transaction_date.gte = filters.startDate
      }
      if (filters.endDate) {
        whereClause.transaction_date.lte = filters.endDate
      }
    }

    return await prisma.transaction.findMany({
      where: whereClause,
      orderBy: {
        transaction_date: 'desc',
      },
    })
  }
}
