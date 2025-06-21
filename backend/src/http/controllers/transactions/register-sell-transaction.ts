import { Request, Response } from 'express'
import { z } from 'zod'
import { Decimal } from '@prisma/client/runtime/library'
import { makeRegisterSellTransactionUseCase } from '@/use-cases/factories/make-register-sell-transaction-use-case'

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

  const { cryptoSymbol, quantity, unitPriceAtTransaction, transactionDate } =
    registerSellTransactionBodySchema.parse(request.body)

  const userId = request.user?.id

  if (!userId) {
    return response.status(401).json({ message: 'User not authenticated' })
  }

  const registerSellTransaction = makeRegisterSellTransactionUseCase()

  await registerSellTransaction.execute({
    userId,
    cryptoSymbol,
    quantity,
    unitPriceAtTransaction,
    transactionDate,
  })

  return response.status(201).send()
}
