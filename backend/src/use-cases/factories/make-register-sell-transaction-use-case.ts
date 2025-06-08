import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { PrismaCryptoPriceCacheRepository } from '@/repositories/prisma/prisma-crypto-price-cache-repository'
import { RegisterSellTransactionUseCase } from '../register-sell-transaction'

export function makeRegisterBuyTransactionUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const cryptoPriceCacheRepository = new PrismaCryptoPriceCacheRepository()
  const registerSellTransactionUseCase = new RegisterSellTransactionUseCase(
    transactionsRepository,
    cryptoPriceCacheRepository,
  )

  return registerSellTransactionUseCase
}
