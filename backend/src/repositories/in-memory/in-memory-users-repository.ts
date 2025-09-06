import { Prisma, User } from '@/generated/prisma'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'
import { compare, hash } from 'bcryptjs'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(user)

    return user
  }

  async updateUserName(id: string, name: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    user.name = name

    return user
  }

  async resetPassword(id: string, password: string, newPassword: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user || !(await compare(password, user.password_hash))) {
      throw new Error("Invalid current password.")
    }

    const updatedUser = {
      ...user,
      password_hash: await hash(newPassword, 6),
    }

    return updatedUser
  }
}

export default InMemoryUsersRepository