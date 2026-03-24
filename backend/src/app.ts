import express from 'express'
import cookieParser from 'cookie-parser'
import { userRoutes } from './http/controllers/users/routes'
import { cryptoRoutes } from './http/controllers/crypto/routes'
import { transactionsRoutes } from './http/controllers/transactions/routes'
import { adminRoutes } from './http/controllers/admin/routes'
import { healthRoutes } from './http/controllers/health/routes'
import { errorHandler } from './http/middlewares/error-handler'
import cors from 'cors'

export const app = express()

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://coin-trackr-gamma.vercel.app'],
    credentials: true,
  }),
)

app.use(express.json())
app.use(cookieParser())

app.use('/health', healthRoutes)

app.use('/admin', adminRoutes)
app.use(userRoutes)
app.use('/cryptos', cryptoRoutes)
app.use('/transactions', transactionsRoutes)

app.use(errorHandler)
