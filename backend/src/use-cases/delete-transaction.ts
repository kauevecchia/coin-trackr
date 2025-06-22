import { TransactionsRepository } from '@/repositories/transactions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteTransactionUseCaseRequest {
  userId: string
  transactionId: string
}

export class DeleteTransactionUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    userId,
    transactionId,
  }: DeleteTransactionUseCaseRequest): Promise<void> {
    try {
      await this.transactionsRepository.delete(userId, transactionId)
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new ResourceNotFoundError()
      }
      throw error
    }
  }
}
