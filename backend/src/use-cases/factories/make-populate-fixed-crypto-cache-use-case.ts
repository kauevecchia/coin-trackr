import { PrismaCryptoCacheRepository } from '@/repositories/prisma/prisma-crypto-cache-repository'
import { PopulateFixedCryptoCacheUseCase } from '../populate-fixed-crypto-cache'

export function makePopulateFixedCryptoCacheUseCase() {
  const cryptoCacheRepository = new PrismaCryptoCacheRepository()
  const populateFixedCryptoUseCase = new PopulateFixedCryptoCacheUseCase(
    cryptoCacheRepository,
  )

  return populateFixedCryptoUseCase
}
