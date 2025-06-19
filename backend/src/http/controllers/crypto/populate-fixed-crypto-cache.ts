import { Request, Response } from 'express'
import { makePopulateFixedCryptoCacheUseCase } from '@/use-cases/factories/make-populate-fixed-crypto-cache-use-case'

export async function populateFixedCryptoUseCase(
  request: Request,
  response: Response,
) {
  try {
    const populateFixedCryptoCacheUseCase =
      makePopulateFixedCryptoCacheUseCase()

    await populateFixedCryptoCacheUseCase.execute()

    return response.status(204).send()
  } catch (error) {
    return response.status(500).send()
  }
}
