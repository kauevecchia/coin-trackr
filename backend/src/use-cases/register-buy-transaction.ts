import { Decimal } from '@prisma/client/runtime/library'
import { TransactionsRepository } from '@/repositories/transactions-repository'
import { CryptoCacheRepository } from '@/repositories/crypto-cache-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface RegisterBuyTransactionUseCaseRequest {
  userId: string
  cryptoId: string
  quantity: Decimal
  unitPriceAtTransaction: Decimal
  transactionDate: Date
}

export class RegisterBuyTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private cryptoPriceCacheRepository: CryptoCacheRepository,
  ) {}

  async execute({
    userId,
    cryptoId,
    quantity,
    unitPriceAtTransaction,
    transactionDate,
  }: RegisterBuyTransactionUseCaseRequest) {
    const cryptoData =
      await this.cryptoPriceCacheRepository.findBySymbol(cryptoId)

    if (!cryptoData) {
      throw new ResourceNotFoundError()
    }

    const transaction = await this.transactionsRepository.create({
      user_id: userId,
      crypto_symbol: cryptoData.symbol,
      crypto_name: cryptoData.name,
      quantity,
      price_at_transaction: unitPriceAtTransaction,
      transaction_type: 'BUY',
      transaction_date: transactionDate,
    })

    return { transaction }
  }
}
