import express from 'express'
import { PrismaClient } from './generated/prisma'
import cookieParser from 'cookie-parser'
import { userRoutes } from './http/controllers/users/routes'

export const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(userRoutes)

const prisma = new PrismaClient()
