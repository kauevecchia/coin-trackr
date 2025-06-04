import { Router } from 'express'
import { register } from './register'
import { authenticate } from './authenticate'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { profile } from './profile'
import { refresh } from './refresh'

const userRoutes = Router()

userRoutes.post('/users', register)
userRoutes.post('/sessions', authenticate)

userRoutes.post('/token/refresh', refresh)

userRoutes.get('/me', verifyJWT, profile)

export { userRoutes }
