import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { DeleteAccountUseCase } from '../delete-account'

export function makeDeleteAccountUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const deleteAccountUseCase = new DeleteAccountUseCase(usersRepository)

  return deleteAccountUseCase
}
