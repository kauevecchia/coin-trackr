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
  } catch (error) {
    console.error('Error creating transaction:', error)
    return response.status(500).json({ message: 'Failed to create transaction' })
  }
}
