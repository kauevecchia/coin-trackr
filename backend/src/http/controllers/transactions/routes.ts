import { Router } from 'express'
import { deleteTransaction } from './delete-transaction'
import { registerBuyTransaction } from './register-buy-transaction'
import { registerSellTransaction } from './register-sell-transaction'
import { listUserTransactions } from './list-user-transactions'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

const transactionsRoutes = Router()

transactionsRoutes.use(verifyJWT)

transactionsRoutes.post('/buy', registerBuyTransaction)
transactionsRoutes.post('/sell', registerSellTransaction)
transactionsRoutes.delete('/delete', deleteTransaction)
transactionsRoutes.get('/list', listUserTransactions)

export { transactionsRoutes }
