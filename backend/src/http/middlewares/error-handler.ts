import { Request, Response } from 'express'
import { ZodError } from 'zod'
import { env } from '@/env'

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res.status(400).send({
      message: 'Validation error.',
      issues: err.format(),
    })
  }

  if (env.NODE_ENV !== 'production' && env.NODE_ENV !== 'test') {
    console.error('GLOBAL_ERROR_HANDLER_LOG:', err)
    if (err.stack) {
      console.error(err.stack)
    }
  }

  if (env.NODE_ENV === 'test') {
    console.error('TEST_ERROR_HANDLED:', {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    })
  }

  return res.status(500).send({ message: 'Internal server error.' })
}
