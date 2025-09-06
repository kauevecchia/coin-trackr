import { Request, Response } from 'express'
import { z } from 'zod'
import { Decimal } from '@prisma/client/runtime/library'
import { makeRegisterSellTransactionUseCase } from '@/use-cases/factories/make-register-sell-transaction-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { InsufficientFundsError } from '@/use-cases/errors/insufficient-funds-error'

export async function registerSellTransaction(
  request: Request,
  response: Response,
) {
  const registerSellTransactionBodySchema = z.object({
    cryptoSymbol: z.string(),
    cryptoQuantity: z.coerce.number().transform((value) => new Decimal(value)),
    usdAmount: z.coerce.number().transform((value) => new Decimal(value)),
    unitPriceAtTransaction: z.coerce
      .number()
      .transform((value) => new Decimal(value)),
    transactionDate: z.coerce.date().transform((value) => new Date(value)),
  })

  let cryptoSymbol: string
  let cryptoQuantity: Decimal
  let usdAmount: Decimal
  let unitPriceAtTransaction: Decimal
  let transactionDate: Date

  try {
    const result = registerSellTransactionBodySchema.parse(request.body)
    cryptoSymbol = result.cryptoSymbol
    cryptoQuantity = result.cryptoQuantity
    usdAmount = result.usdAmount
    unitPriceAtTransaction = result.unitPriceAtTransaction
    transactionDate = result.transactionDate
  } catch (err) {
    if (err instanceof z.ZodError) {
      return response.status(400).send({
        message: 'Validation error.',
        issues: err.format(),
      })
    }
    return response.status(500).json({ message: 'Internal server error.' })
  }

  const userId = request.user?.id

  if (!userId) {
    return response.status(401).json({ message: 'User not authenticated' })
  }

  try {
    const registerSellTransaction = makeRegisterSellTransactionUseCase()

    const { transaction } = await registerSellTransaction.execute({
      userId,
      cryptoSymbol,
      quantity: cryptoQuantity,
      unitPriceAtTransaction,
      transactionDate,
    })

    return response.status(201).json({ 
      message: 'Transaction created successfully',
      transaction: {
        id: transaction.id,
        crypto_symbol: transaction.crypto_symbol,
        crypto_name: transaction.crypto_name,
        crypto_quantity: transaction.crypto_quantity.toString(),
        usd_amount: transaction.usd_amount.toString(),
        price_at_transaction: transaction.price_at_transaction.toString(),
        transaction_type: transaction.transaction_type,
        transaction_date: transaction.transaction_date,
        created_at: transaction.created_at,
        updated_at: transaction.updated_at,
      }
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return response.status(404).json({ message: 'Crypto not found' })
    }
    if (err instanceof InsufficientFundsError) {
      return response
        .status(400)
        .json({ message: 'Insufficient funds for this crypto' })
    }
    return response.status(500).json({ message: 'Internal server error.' })
  }
}
