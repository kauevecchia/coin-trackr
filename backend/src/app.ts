import express from 'express'
import { PrismaClient } from './generated/prisma'

export const app = express()

const prisma = new PrismaClient()
