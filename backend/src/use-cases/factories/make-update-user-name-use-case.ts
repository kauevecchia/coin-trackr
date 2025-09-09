import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UpdateUserNameUseCase } from '../update-user-name'

export function makeUpdateUserNameUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const updateUserNameUseCase = new UpdateUserNameUseCase(usersRepository)

  return updateUserNameUseCase
}