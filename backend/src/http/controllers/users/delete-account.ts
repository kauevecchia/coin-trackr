import { Request, Response } from 'express'
import { z } from 'zod'
import { makeDeleteAccountUseCase } from '@/use-cases/factories/make-delete-account-use-case'

export async function deleteAccount(request: Request, response: Response) {
  try {
    const userId = request.user?.id

    const deleteAccountUseCase = makeDeleteAccountUseCase()
    await deleteAccountUseCase.execute({ 
      userId: userId!, 
    })

    return response.status(200).json({
      message: 'Account deleted successfully',
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return response.status(400).json({ 
        message: 'Validation error', 
        errors: err.errors 
      })
    }

    if (err instanceof Error) {
      return response.status(404).json({ message: err.message })
    }

    return response.status(500).json({ message: 'Internal server error.' })
  }
}