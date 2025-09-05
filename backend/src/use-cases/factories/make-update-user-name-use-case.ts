import { UpdateUserNameUseCase } from "@/use-cases/update-user-name"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"

const makeUpdateUserNameUseCase = () => {
  const usersRepository = new PrismaUsersRepository()
  const updateUserNameUseCase = new UpdateUserNameUseCase(usersRepository)

  return updateUserNameUseCase
}

export default makeUpdateUserNameUseCase