import { PrismaTransactionsRepository } from '@/repositories/prisma/prisma-transactions-repository'
import { DeleteTransactionUseCase } from '../delete-transaction'

export function makeDeleteTransactionUseCase() {
  const transactionRepository = new PrismaTransactionsRepository()
  const deleteTransactionUseCase = new DeleteTransactionUseCase(
    transactionRepository,
  )

  return deleteTransactionUseCase
}
