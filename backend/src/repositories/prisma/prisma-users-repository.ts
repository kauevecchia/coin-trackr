import { prisma } from '@/lib/prisma'
import { UsersRepository } from '../users-repository'
import { Prisma } from '@/generated/prisma'
import { compare, hash } from 'bcryptjs'

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async updateUserName(id: string, name: string) {
    const user = await prisma.user.update({
      where: { id },
      data: { name },
    })
    return user
  }

  async resetPassword(id: string, password: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user || !(await compare(password, user.password_hash))) {
      throw new Error("Invalid current password.")
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { password_hash: await hash(newPassword, 6) },
    })

    if (!updatedUser) {
      throw new Error("Failed to update password.")
    }

    return updatedUser
  }
}
