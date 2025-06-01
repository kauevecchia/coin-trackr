import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { Request, Response } from 'express'

export async function profile(request: Request, response: Response) {
  const userId = request.user?.id

  if (!userId) {
    return response
      .status(400)
      .json({ message: 'user ID not found in request' })
  }

  try {
    const getUserProfileUseCase = makeGetUserProfileUseCase()
    const { user } = await getUserProfileUseCase.execute({ userId })

    return response.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return response.status(404).json({ message: err.message })
    }
    console.error(err)
    return response
      .status(500)
      .json({ message: 'internal server error getting user profile' })
  }
}
