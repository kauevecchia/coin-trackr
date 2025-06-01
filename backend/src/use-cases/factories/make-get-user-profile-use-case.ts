import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile-use-case'

export function makeGetUserProfileUseCase() {
  const userRepository = new PrismaUsersRepository()
  const getUserProfileUseCase = new GetUserProfileUseCase(userRepository)

  return getUserProfileUseCase
}
