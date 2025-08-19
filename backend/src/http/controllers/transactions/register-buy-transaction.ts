import { makeRegisterBuyTransactionUseCase } from '@/use-cases/factories/make-register-buy-transaction-use-case'
import { Request, Response } from 'express'
import { z } from 'zod'
import { Decimal } from '@prisma/client/runtime/library'

export async function registerBuyTransaction(
  request: Request,
  response: Response,
) {
  const registerBuyTransactionBodySchema = z.object({
    cryptoSymbol: z.string(),
    cryptoQuantity: z.coerce.number().transform((value) => new Decimal(value)),
    usdAmount: z.coerce.number().transform((value) => new Decimal(value)),
    unitPriceAtTransaction: z.coerce
      .number()
      .transform((value) => new Decimal(value)),
    transactionDate: z.coerce.date().transform((value) => new Date(value)),
  })

  const { cryptoSymbol, cryptoQuantity, usdAmount, unitPriceAtTransaction, transactionDate } =
    registerBuyTransactionBodySchema.parse(request.body)

  const userId = request.user?.id

  if (!userId) {
    return response.status(401).json({ message: 'User not authenticated' })
  }

  try {
    const registerBuyTransaction = makeRegisterBuyTransactionUseCase()

    const { transaction } = await registerBuyTransaction.execute({
      userId,
      cryptoSymbol,
      cryptoQuantity,
      usdAmount,
      unitPriceAtTransaction,
      transactionDate,
    })

    return response.status(201).json({ 
      message: 'Transaction created successfully',
      transaction: {
        id: transaction.id,
        cryptoSymbol: transaction.crypto_symbol,
        cryptoName: transaction.crypto_name,
        cryptoQuantity: transaction.crypto_quantity.toString(),
        usdAmount: transaction.usd_amount.toString(),
        priceAtTransaction: transaction.price_at_transaction.toString(),
        transactionType: transaction.transaction_type,
        transactionDate: transaction.transaction_date,
      }
    })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return response.status(500).json({ message: 'Failed to create transaction' })
  }
}
