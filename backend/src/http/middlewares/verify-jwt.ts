import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import { env } from '../../env'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
      }
    }
  }
}

export async function verifyJWT(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Token not provided.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decodedToken = verify(token, env.JWT_SECRET)

    request.user = { id: decodedToken.sub as string }

    next()
  } catch (err) {
    return response.status(401).json({ message: 'Invalid or expired token.' })
  }
}
