import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { Request, Response } from 'express'
import { z } from 'zod'

export async function register(request: Request, response: Response) {
  const registerBodySchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(24, 'Name must be less than 24 characters'),
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  })

  try {
    const { name, email, password } = registerBodySchema.parse(request.body)

    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
      name,
      email,
      password,
    })

    return response.status(201).send()
  } catch (err) {
    if (err instanceof z.ZodError) {
      return response.status(400).json({
        message: 'Validation error',
        errors: err.errors
      })
    }

    if (err instanceof UserAlreadyExistsError) {
      return response.status(409).json({
        message: err.message,
      })
    }

    return response.status(500).json({ message: 'Internal server error.' })
  }
}
