import { User } from "@/generated/prisma"
import { UsersRepository } from "@/repositories/users-repository"

interface ResetPasswordUseCaseRequest {
  userId: string
  password: string
  newPassword: string
}

interface ResetPasswordUseCaseResponse {
  user: User
}

export class ResetPasswordUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId, password, newPassword }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    const user = await this.usersRepository.resetPassword(userId, password, newPassword)

    if (!user) {
      throw new Error("User not found")
    }

    return { user }
  }
}