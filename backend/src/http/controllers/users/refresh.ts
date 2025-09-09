import { Request, Response } from 'express'
import {
  verify,
  sign,
  JsonWebTokenError,
  TokenExpiredError,
} from 'jsonwebtoken'
import { env } from '../../../env'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'

export async function refresh(request: Request, response: Response) {
  const refreshToken = request.cookies.refreshToken

  if (!refreshToken) {
    return response
      .status(401)
      .json({ message: 'Refresh token não fornecido.' })
  }

  try {
    const decodedToken = verify(refreshToken, env.JWT_SECRET)

    if (typeof decodedToken !== 'object' || !('sub' in decodedToken)) {
      return response.status(401).json({ message: 'Refresh token inválido.' })
    }

    const userId = decodedToken.sub as string

    // Get updated user data from database
    const getUserProfileUseCase = makeGetUserProfileUseCase()
    const { user } = await getUserProfileUseCase.execute({ userId })

    const newAccessToken = sign(
      { sub: userId, email: user.email, name: user.name },
      env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const newRefreshToken = sign(
      { sub: userId, email: user.email, name: user.name },
      env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    response.cookie('refreshToken', newRefreshToken, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })

    return response.status(200).json({
      token: newAccessToken,
    })
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return response.status(401).json({ message: 'Refresh token expired.' })
    }
    if (err instanceof JsonWebTokenError) {
      return response.status(401).json({ message: 'Refresh token invalid.' })
    }

    console.error('Refresh token error:', err)
    return response
      .status(500)
      .json({ message: 'Internal server error to refresh token.' })
  }
}
