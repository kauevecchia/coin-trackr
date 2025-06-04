import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { Server } from 'http'
import request from 'supertest'

export async function createAndAuthenticateUser(app: Server) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    },
  })

  const authResponse = await request(app).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
