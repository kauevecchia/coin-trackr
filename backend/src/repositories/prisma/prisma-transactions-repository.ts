import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma'
import { TransactionsRepository } from '../transactions-repository'

export class PrismaTransactionsRepository implements TransactionsRepository {
  async create(data: Prisma.TransactionUncheckedCreateInput) {
    const transaction = await prisma.transaction.create({
      data,
    })

    return transaction
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
}
