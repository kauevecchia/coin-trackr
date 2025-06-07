import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { RegisterBuyTransactionUseCase } from '../register-buy-transaction'
import { PrismaCryptoPriceCacheRepository } from '@/repositories/prisma/prisma-crypto-price-cache-repository'

export function makeRegisterBuyTransactionUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const cryptoPriceCacheRepository = new PrismaCryptoPriceCacheRepository()
  const registerBuyTransactionUseCase = new RegisterBuyTransactionUseCase(
    transactionsRepository,
    cryptoPriceCacheRepository,
  )

  return registerBuyTransactionUseCase
}
