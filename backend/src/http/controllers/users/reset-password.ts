import { Request, Response } from 'express'
import { z } from 'zod'
import { makeResetPasswordUseCase } from '@/use-cases/factories/make-reset-password-use-case'

export async function resetPassword(request: Request, response: Response) {
  const resetPasswordBodySchema = z.object({
    currentPassword: z.string().min(6, 'Password must be at least 6 characters long'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
  })

  try {
    const { currentPassword, newPassword } = resetPasswordBodySchema.parse(request.body)
    const userId = request.user?.id

    const resetPasswordUseCase = makeResetPasswordUseCase()
    await resetPasswordUseCase.execute({ 
      userId: userId!, 
      password: currentPassword, 
      newPassword 
    })

    return response.status(200).json({
      message: 'Password updated successfully',
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return response.status(400).json({ 
        message: 'Validation error', 
        errors: err.errors 
      })
    }

    if (err instanceof Error) {
      if (err.message.includes('Invalid current password')) {
        return response.status(401).json({ message: 'Current password is incorrect' })
      }
      return response.status(404).json({ message: err.message })
    }

    return response.status(500).json({ message: 'Internal server error.' })
  }
}