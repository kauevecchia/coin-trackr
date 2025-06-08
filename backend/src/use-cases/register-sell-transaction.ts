import { Decimal } from '@prisma/client/runtime/library'
import { TransactionsRepository } from '@/repositories/transactions-repository'
import { CryptoPriceCacheRepository } from '@/repositories/crypto-price-cache-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InsufficientFundsError } from './errors/insufFicient-funds-error'
import { TransactionType } from '@/generated/prisma'

interface RegisterSellTransactionUseCaseRequest {
  userId: string
  cryptoSymbol: string
  quantity: Decimal
  unitPriceAtTransaction: Decimal
  transactionDate: Date
}

export class RegisterSellTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private cryptoPriceCacheRepository: CryptoPriceCacheRepository,
  ) {}

  async execute({
    userId,
    cryptoSymbol,
    quantity,
    unitPriceAtTransaction,
    transactionDate,
  }: RegisterSellTransactionUseCaseRequest) {
    const cryptoData =
      await this.cryptoPriceCacheRepository.findBySymbol(cryptoSymbol)

    if (!cryptoData) {
      throw new ResourceNotFoundError()
    }

    const userTransactionsForCrypto =
      await this.transactionsRepository.findManyByUserIdAndCryptoSymbol(
        userId,
        cryptoSymbol,
      )

    let currentBalance = new Decimal(0)
    for (const transactions of userTransactionsForCrypto) {
      if (transactions.transaction_type === TransactionType.BUY) {
        currentBalance = currentBalance.plus(transactions.quantity)
      } else {
        currentBalance = currentBalance.minus(transactions.quantity)
      }
    }

    if (quantity.greaterThan(currentBalance)) {
      throw new InsufficientFundsError()
    }

    const transaction = await this.transactionsRepository.create({
      user_id: userId,
      crypto_symbol: cryptoData.symbol,
      crypto_name: cryptoData.name,
      quantity,
      price_at_transaction: unitPriceAtTransaction,
      transaction_type: TransactionType.SELL,
      transaction_date: transactionDate,
    })

    return { transaction }
  }
}
