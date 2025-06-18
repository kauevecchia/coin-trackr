import { Request, Response } from 'express'
import { makeGetAllFixedCryptoDetailsUseCase } from '@/use-cases/factories/make-get-all-fixed-crypto-details-use-case'

export async function getAllFixedCryptoDetails(
  request: Request,
  response: Response,
) {
  try {
    const getAllFixedCryptoDetails = makeGetAllFixedCryptoDetailsUseCase()

    const cryptoDetails = await getAllFixedCryptoDetails.execute()

    return response.status(200).send(cryptoDetails)
  } catch (error) {
    return response.status(500).send({ message: 'Internal server error' })
  }
}
