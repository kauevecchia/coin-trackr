import { Router } from 'express'
import { register } from './register'
import { authenticate } from './authenticate'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { profile } from './profile'
import { refresh } from './refresh'
import { logout } from './logout'
import { updateUserName } from './update-user-name'
import { resetPassword } from './reset-password'
import { deleteAccount } from './delete-account'

const userRoutes = Router()

userRoutes.post('/users', register)
userRoutes.post('/sessions', authenticate)

userRoutes.post('/token/refresh', refresh)
userRoutes.post('/logout', logout)

userRoutes.get('/me', verifyJWT, profile)
userRoutes.patch('/users/update-name', verifyJWT, updateUserName)
userRoutes.patch('/users/reset-password', verifyJWT, resetPassword)
userRoutes.delete('/users/delete-account', verifyJWT, deleteAccount)

export { userRoutes }
