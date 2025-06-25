import { PrismaCryptoCacheRepository } from '@/repositories/prisma/prisma-crypto-cache-repository'
import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { CreateTransactionUseCase } from '../create-transaction'

export function makeCreateTransactionUseCase() {
  const transactionRepository = new PrismaTransactionsRepository()
  const cryptoCacheRepository = new PrismaCryptoCacheRepository()
  const createTransactionUseCase = new CreateTransactionUseCase(
    transactionRepository,
    cryptoCacheRepository,
  )

  return createTransactionUseCase
}
