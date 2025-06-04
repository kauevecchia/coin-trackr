import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { Server } from 'http'

let testServer: Server

describe('Refresh Token (e2e)', () => {
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

  it('should be able to refresh token', async () => {
    await request(testServer).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const response = await request(testServer).post('/sessions').send({
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })

    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
