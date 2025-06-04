import express from 'express'
import { PrismaClient } from './generated/prisma'
import cookieParser from 'cookie-parser'
import { userRoutes } from './http/controllers/users/routes'
import { errorHandler } from './http/middlewares/error-handler'

export const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(userRoutes)

app.use(errorHandler)

const prisma = new PrismaClient()
