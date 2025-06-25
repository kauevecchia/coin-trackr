import { TransactionType } from '@/generated/prisma'
import { TransactionsRepository } from '@/repositories/transactions-repository'

interface ListUserTransactionsUseCaseRequest {
  userId: string
  filters?: {
    transactionType?: TransactionType
    cryptoSymbol?: string
    startDate?: Date
    endDate?: Date
  }
}

export class ListUserTransactionsUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({ userId, filters }: ListUserTransactionsUseCaseRequest) {
    const transactions =
      await this.transactionsRepository.findTransactionsByFilters(
        userId,
        filters,
      )

    return { transactions }
  }
}
