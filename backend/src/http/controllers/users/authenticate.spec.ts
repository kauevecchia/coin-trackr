import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import { hash } from 'bcryptjs'
import { Server } from 'http'

let testServer: Server

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    testServer = app.listen(0)
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

  beforeEach(async () => {
    await prisma.transaction.deleteMany()
    await prisma.cryptoCache.deleteMany()
    await prisma.user.deleteMany()
  })

  it('should be able to authenticate', async () => {
    const passwordHash = await hash('123456', 6)
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password_hash: passwordHash,
      },
    })

    const response = await request(app).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })

    expect(response.headers['set-cookie']).toBeDefined()
    expect(response.headers['set-cookie'][0]).toContain('refreshToken=')
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly')
    expect(response.headers['set-cookie'][0]).toContain('Path=/')
  })

  it('should not be able to authenticate with wrong credentials', async () => {
    const passwordHash = await hash('123456', 6)
    await prisma.user.create({
      data: {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password_hash: passwordHash,
      },
    })

    const response = await request(app).post('/sessions').send({
      email: 'jane.doe@example.com',
      password: 'wrongpassword',
    })

    expect(response.statusCode).toEqual(401)
    expect(response.body).toEqual({
      message: 'Invalid credentials',
    })
  })

  it('should not be able to authenticate with non-existent user', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'nonexistent@example.com',
      password: 'anypassword',
    })

    expect(response.statusCode).toEqual(401)
    expect(response.body).toEqual({
      message: 'Invalid credentials',
    })
  })
})
