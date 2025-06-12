import { Request, Response } from 'express'
import { z } from 'zod'
import { makeDeleteTransactionUseCase } from '@/use-cases/factories/make-delete-transaction-use-case'

export async function deleteTransaction(request: Request, response: Response) {
  const deleteTransactionBodySchema = z.object({
    userId: z.string(),
    transactionId: z.string(),
  })

  const { userId, transactionId } = deleteTransactionBodySchema.parse(
    request.body,
  )

  const deleteTransaction = makeDeleteTransactionUseCase()

  await deleteTransaction.execute({
    userId,
    transactionId,
  })

  return response.status(201).send()
}
