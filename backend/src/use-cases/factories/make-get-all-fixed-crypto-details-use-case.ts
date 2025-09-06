import { PrismaCryptoCacheRepository } from '@/repositories/prisma/prisma-crypto-cache-repository'
import { GetAllFixedCryptoDetailsUseCase } from '../get-all-fixed-crypto-details'

export function makeGetAllFixedCryptoDetailsUseCase() {
  const cryptoCacheRepository = new PrismaCryptoCacheRepository()
  const getAllFixedCryptoDetailsUseCase = new GetAllFixedCryptoDetailsUseCase(
    cryptoCacheRepository,
  )

  return getAllFixedCryptoDetailsUseCase
}
