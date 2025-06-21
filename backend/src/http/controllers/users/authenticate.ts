// src/http/controllers/users/authenticate.ts
import { Request, Response } from 'express'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { sign } from 'jsonwebtoken'
import { env } from '../../../env'

export async function authenticate(request: Request, response: Response) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  try {
    const { email, password } = authenticateBodySchema.parse(request.body)
    const authenticateUserUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUserUseCase.execute({
      email,
      password,
    })

    const accessToken = sign({ sub: user.id }, env.JWT_SECRET, {
      expiresIn: '15m',
    })

    const refreshToken = sign({ sub: user.id }, env.JWT_SECRET, {
      expiresIn: '7d',
    })

    response.cookie('refreshToken', refreshToken, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })

    return response.status(200).json({ token: accessToken })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return response.status(400).json({ message: err.message })
    }
    return response.status(500).json({ message: 'Internal server error.' })
  }
}
