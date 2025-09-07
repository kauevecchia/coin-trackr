import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { UsersRepository } from '@/repositories/users-repository'
import { compare } from 'bcryptjs'

interface DeleteAccountUseCaseRequest {
  userId: string
  password: string
}

export class DeleteAccountUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    password,
  }: DeleteAccountUseCaseRequest) {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    await this.usersRepository.deleteAccount(userId)

    return { success: true }
  }
}
