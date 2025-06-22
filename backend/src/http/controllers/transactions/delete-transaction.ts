import { Request, Response } from 'express'
import { z } from 'zod'
import { makeDeleteTransactionUseCase } from '@/use-cases/factories/make-delete-transaction-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function deleteTransaction(request: Request, response: Response) {
  const deleteTransactionBodySchema = z.object({
    transactionId: z.string(),
  })

  let transactionId: string

  try {
    const result = deleteTransactionBodySchema.parse(request.body)
    transactionId = result.transactionId
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
    const deleteTransaction = makeDeleteTransactionUseCase()

    await deleteTransaction.execute({
      userId,
      transactionId,
    })

    return response.status(201).send()
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return response.status(404).json({ message: 'Transaction not found' })
    }
    return response.status(500).json({ message: 'Internal server error.' })
  }
}
