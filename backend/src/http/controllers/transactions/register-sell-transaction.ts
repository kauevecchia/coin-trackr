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
    quantity: z.coerce.number().transform((value) => new Decimal(value)),
    unitPriceAtTransaction: z.coerce
      .number()
      .transform((value) => new Decimal(value)),
    transactionDate: z.coerce.date().transform((value) => new Date(value)),
  })

  let cryptoSymbol: string
  let quantity: Decimal
  let unitPriceAtTransaction: Decimal
  let transactionDate: Date

  try {
    const result = registerSellTransactionBodySchema.parse(request.body)
    cryptoSymbol = result.cryptoSymbol
    quantity = result.quantity
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

    await registerSellTransaction.execute({
      userId,
      cryptoSymbol,
      quantity,
      unitPriceAtTransaction,
      transactionDate,
    })

    return response.status(201).send()
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
