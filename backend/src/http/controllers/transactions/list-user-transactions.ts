import { Request, Response } from 'express'
import { z } from 'zod'
import { TransactionType } from '@/generated/prisma'
import { makeListUserTransactionsUseCase } from '@/use-cases/factories/make-list-user-transactions-use-case'

export async function listUserTransactions(
  request: Request,
  response: Response,
) {
  const listUserTransactionsBodySchema = z.object({
    userId: z.string(),
    filters: z
      .object({
        transactionType: z.nativeEnum(TransactionType).optional(),
        cryptoSymbol: z.string().optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
      })
      .optional(),
  })

  const { userId, filters } = listUserTransactionsBodySchema.parse(request.body)

  const listUserTransactions = makeListUserTransactionsUseCase()

  await listUserTransactions.execute({
    userId,
    filters,
  })

  return response.status(200).send()
}
