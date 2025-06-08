import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { RegisterBuyTransactionUseCase } from '../register-buy-transaction'
import { PrismaCryptoCacheRepository } from '@/repositories/prisma/prisma-crypto-cache-repository'

export function makeRegisterBuyTransactionUseCase() {
  const transactionsRepository = new PrismaTransactionsRepository()
  const cryptoCacheRepository = new PrismaCryptoCacheRepository()
  const registerBuyTransactionUseCase = new RegisterBuyTransactionUseCase(
    transactionsRepository,
    cryptoCacheRepository,
  )

  return registerBuyTransactionUseCase
}
