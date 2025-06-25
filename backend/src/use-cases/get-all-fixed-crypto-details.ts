import { CryptoCacheRepository } from '@/repositories/crypto-cache-repository'

export class GetAllFixedCryptoDetailsUseCase {
  constructor(private readonly cryptoCacheRepository: CryptoCacheRepository) {}

  async execute() {
    const cryptoCache = await this.cryptoCacheRepository.findAll()

    return cryptoCache
  }
}
