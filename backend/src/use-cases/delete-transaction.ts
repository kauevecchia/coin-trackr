import { TransactionsRepository } from '@/repositories/transactions-repository'

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
    await this.transactionsRepository.delete(userId, transactionId)
  }
}
