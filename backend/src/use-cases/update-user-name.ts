import { User } from "@/generated/prisma"
import { UsersRepository } from "@/repositories/users-repository"

interface UpdateUserNameUseCaseRequest {
  userId: string
  name: string
}

interface UpdateUserNameUseCaseResponse {
  user: User
}

export class UpdateUserNameUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId, name }: UpdateUserNameUseCaseRequest): Promise<UpdateUserNameUseCaseResponse> {
    const user = await this.usersRepository.updateUserName(userId, name)

    if (!user) {
      throw new Error("User not found")
    }

    return { user }
  }
}