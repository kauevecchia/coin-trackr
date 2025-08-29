import { Decimal } from '@prisma/client/runtime/library'
import { TransactionsRepository } from '@/repositories/transactions-repository'
import { CryptoCacheRepository } from '@/repositories/crypto-cache-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CreateTransactionUseCaseRequest {
  userId: string
  cryptoId: string
  quantity: Decimal
  unitPriceAtTransaction: Decimal
  transactionType: 'BUY' | 'SELL'
  transactionDate: Date
}

export class CreateTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private cryptoCacheRepository: CryptoCacheRepository,
  ) {}

  async execute({
    userId,
    cryptoId,
    quantity,
    unitPriceAtTransaction,
    transactionType,
    transactionDate,
  }: CreateTransactionUseCaseRequest) {
    const cryptoData = await this.cryptoCacheRepository.findBySymbol(cryptoId)

    if (!cryptoData) {
      throw new ResourceNotFoundError()
    }

    const transaction = await this.transactionsRepository.create({
      user_id: userId,
      crypto_symbol: cryptoData.symbol,
      crypto_name: cryptoData.name,
      crypto_quantity: quantity,
      usd_amount: quantity.mul(unitPriceAtTransaction),
      price_at_transaction: unitPriceAtTransaction,
      transaction_type: transactionType,
      transaction_date: transactionDate,
    })

    return { transaction }
  }
}
