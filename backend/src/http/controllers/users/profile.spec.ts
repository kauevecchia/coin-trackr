import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { Server } from 'http'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

let testServer: Server

describe('Profile (e2e)', () => {
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

  it('should be able to get user profile', async () => {
    const { token } = await createAndAuthenticateUser(testServer)

    const profileResponse = await request(testServer)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com',
      }),
    )
  })
})
