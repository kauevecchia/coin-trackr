import { Request, Response } from 'express'
import { z } from 'zod'
import { makeDeleteAccountUseCase } from '@/use-cases/factories/make-delete-account-use-case'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

const deleteAccountBodySchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function deleteAccount(request: Request, response: Response) {
  try {
    const { password } = deleteAccountBodySchema.parse(request.body)
    const userId = request.user?.id

    const deleteAccountUseCase = makeDeleteAccountUseCase()
    await deleteAccountUseCase.execute({ 
      userId: userId!, 
      password,
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

    if (err instanceof InvalidCredentialsError) {
      return response.status(401).json({ message: 'Invalid password' })
    }

    if (err instanceof ResourceNotFoundError) {
      return response.status(404).json({ message: 'User not found' })
    }

    return response.status(500).json({ message: 'Internal server error.' })
  }
}