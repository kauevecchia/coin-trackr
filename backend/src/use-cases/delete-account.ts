import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UsersRepository } from '@/repositories/users-repository'

interface DeleteAccountUseCaseRequest {
  userId: string
}

export class DeleteAccountUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
  }: DeleteAccountUseCaseRequest) {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    await this.usersRepository.deleteAccount(userId)

    return { success: true }
  }
}
