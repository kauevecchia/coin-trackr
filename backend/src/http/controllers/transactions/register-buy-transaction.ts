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
    quantity: z.coerce.number().transform((value) => new Decimal(value)),
    unitPriceAtTransaction: z.coerce
      .number()
      .transform((value) => new Decimal(value)),
    transactionDate: z.coerce.date().transform((value) => new Date(value)),
  })

  const { cryptoSymbol, quantity, unitPriceAtTransaction, transactionDate } =
    registerBuyTransactionBodySchema.parse(request.body)

  const userId = request.user?.id

  if (!userId) {
    return response.status(401).json({ message: 'User not authenticated' })
  }

  const registerBuyTransaction = makeRegisterBuyTransactionUseCase()

  await registerBuyTransaction.execute({
    userId,
    cryptoSymbol,
    quantity,
    unitPriceAtTransaction,
    transactionDate,
  })

  return response.status(201).send()
}
