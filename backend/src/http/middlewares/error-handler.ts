// src/http/middlewares/error-handler.ts

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

  if (env.NODE_ENV !== 'production') {
    console.error(err)
  }

  return res.status(500).send({ message: 'Internal server error.' })
}
