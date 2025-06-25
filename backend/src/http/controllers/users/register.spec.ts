import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { Server } from 'http'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'

let testServer: Server

describe('Register (e2e)', () => {
  beforeAll(async () => {
    testServer = app.listen(0)
  })

  beforeEach(async () => {
    await prisma.transaction.deleteMany()
    await prisma.cryptoCache.deleteMany()
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await new Promise((resolve, reject) => {
      if (testServer) {
        testServer.close((err) => {
          if (err) reject(err)
          resolve(true)
        })
      } else {
        resolve(true)
      }
    })
  })

  it('should be able to register', async () => {
    const response = await request(testServer).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })

  it('should not be able to register with same email twice', async () => {
    await request(testServer).post('/users').send({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'abcdef',
    })

    const response = await request(testServer).post('/users').send({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'password2',
    })

    expect(response.statusCode).toEqual(409)
    expect(response.body).toEqual({ message: 'User already exists' })
  })
})
