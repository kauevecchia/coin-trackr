import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { PrismaCryptoCacheRepository } from '@/repositories/prisma/prisma-crypto-cache-repository'
import { RegisterSellTransactionUseCase } from '../register-sell-transaction'

export function makeRegisterSellTransactionUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const cryptoCacheRepository = new PrismaCryptoCacheRepository()
  const registerSellTransactionUseCase = new RegisterSellTransactionUseCase(
    transactionsRepository,
    cryptoCacheRepository,
  )

  return registerSellTransactionUseCase
}
