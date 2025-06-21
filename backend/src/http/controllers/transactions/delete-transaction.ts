import { Request, Response } from 'express'
import { z } from 'zod'
import { makeDeleteTransactionUseCase } from '@/use-cases/factories/make-delete-transaction-use-case'

export async function deleteTransaction(request: Request, response: Response) {
  const deleteTransactionBodySchema = z.object({
    transactionId: z.string(),
  })

  const { transactionId } = deleteTransactionBodySchema.parse(request.body)

  const userId = request.user?.id

  if (!userId) {
    return response.status(401).json({ message: 'User not authenticated' })
  }

  const deleteTransaction = makeDeleteTransactionUseCase()

  await deleteTransaction.execute({
    userId,
    transactionId,
  })

  return response.status(201).send()
}
