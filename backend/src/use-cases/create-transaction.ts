import { Decimal } from '@prisma/client/runtime/library'
import { TransactionsRepository } from '@/repositories/transactions-repository'
import { CryptoPriceCacheRepository } from '@/repositories/crypto-price-cache-repository'

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
    private cryptoPriceCacheRepository: CryptoPriceCacheRepository,
  ) {}

  async execute({
    userId,
    cryptoId,
    quantity,
    unitPriceAtTransaction,
    transactionType,
    transactionDate,
  }: CreateTransactionUseCaseRequest) {
    const cryptoData =
      await this.cryptoPriceCacheRepository.findBySymbol(cryptoId)

    if (!cryptoData) {
      throw new Error('Crypto not found in cache.')
    }

    const transaction = await this.transactionsRepository.create({
      user_id: userId,
      crypto_symbol: cryptoData.symbol,
      crypto_name: cryptoData.name,
      quantity,
      price_at_transaction: unitPriceAtTransaction,
      transaction_type: transactionType,
      transaction_date: transactionDate,
    })

    return { transaction }
  }
}
