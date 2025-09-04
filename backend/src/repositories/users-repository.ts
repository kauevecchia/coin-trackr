import { Prisma, User } from '@/generated/prisma'

export interface UsersRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
  updateUserName(id: string, name: string): Promise<User | null>
}
