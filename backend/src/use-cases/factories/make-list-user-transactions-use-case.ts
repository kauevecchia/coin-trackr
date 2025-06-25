import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { ListUserTransactionsUseCase } from '../list-user-transactions'

export function makeListUserTransactionsUseCase() {
  const transactionRepository = new PrismaTransactionsRepository()
  const listUserTransactionsUseCase = new ListUserTransactionsUseCase(
    transactionRepository,
  )

  return listUserTransactionsUseCase
}
