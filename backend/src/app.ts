import express from 'express'
import { PrismaClient } from './generated/prisma'
import cookieParser from 'cookie-parser'
import { userRoutes } from './http/controllers/users/routes'
import { cryptoRoutes } from './http/controllers/crypto/routes'
import { transactionsRoutes } from './http/controllers/transactions/routes'
import { errorHandler } from './http/middlewares/error-handler'

export const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(userRoutes)
app.use('/cryptos', cryptoRoutes)
app.use('/', transactionsRoutes)

app.use(errorHandler)

const prisma = new PrismaClient()
