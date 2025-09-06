import { Request, Response } from 'express'
import { z } from 'zod'
import { makeUpdateUserNameUseCase } from '@/use-cases/factories/make-update-user-name-use-case'

export async function updateUserName(request: Request, response: Response) {
  const updateUserNameBodySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
  })

  try {
    const { name } = updateUserNameBodySchema.parse(request.body)
    const userId = request.user?.id

    const updateUserNameUseCase = makeUpdateUserNameUseCase()
    const { user } = await updateUserNameUseCase.execute({ userId: userId!, name })

    return response.status(200).json({
      message: 'Name updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
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