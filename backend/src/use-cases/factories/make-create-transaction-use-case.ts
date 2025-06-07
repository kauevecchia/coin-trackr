import { PrismaCryptoPriceCacheRepository } from '@/repositories/prisma/prisma-crypto-price-cache-repository'
import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { CreateTransactionUseCase } from '../create-transaction'

export function makeCreateTransactionUseCase() {
  const transactionRepository = new PrismaTransactionsRepository()
  const cryptoPriceCacheRepository = new PrismaCryptoPriceCacheRepository()
  const createTransactionUseCase = new CreateTransactionUseCase(
    transactionRepository,
    cryptoPriceCacheRepository,
  )

  return createTransactionUseCase
}
