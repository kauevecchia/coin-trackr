import { Request, Response } from 'express'
import { z } from 'zod'
import { TransactionType } from '@/generated/prisma'
import { makeListUserTransactionsUseCase } from '@/use-cases/factories/make-list-user-transactions-use-case'

export async function listUserTransactions(
  request: Request,
  response: Response,
) {
  const listUserTransactionsQuerySchema = z.object({
    transactionType: z.nativeEnum(TransactionType).optional(),
    cryptoSymbol: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })

  const filters = listUserTransactionsQuerySchema.parse(request.query)
  const userId = request.user?.id

  if (!userId) {
    return response.status(401).json({ message: 'User not authenticated' })
  }

  try {
    const listUserTransactions = makeListUserTransactionsUseCase()

    const { transactions } = await listUserTransactions.execute({
      userId,
      filters,
    })

    return response.status(200).json({ transactions })
  } catch (err) {
    return response.status(500).json({ message: 'Internal server error.' })
  }
}
