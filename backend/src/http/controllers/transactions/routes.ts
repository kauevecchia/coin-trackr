import { Router } from 'express'
import { deleteTransaction } from './delete-transaction'
import { registerBuyTransaction } from './register-buy-transaction'
import { registerSellTransaction } from './register-sell-transaction'
import { listUserTransactions } from './list-user-transactions'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

const transactionsRoutes = Router()

transactionsRoutes.use(verifyJWT)

transactionsRoutes.post('/transactions/buy', registerBuyTransaction)
transactionsRoutes.post('/transactions/sell', registerSellTransaction)
transactionsRoutes.post('/transactions/delete', deleteTransaction)
transactionsRoutes.get('/transactions/list', listUserTransactions)

export { transactionsRoutes }
