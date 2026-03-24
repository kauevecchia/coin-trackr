import { Router } from 'express'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { getAllFixedCryptoDetails } from './get-all-fixed-crypto-details'
import { populateFixedCryptoUseCase } from './populate-fixed-crypto-cache'
import { updatePricesWebhook } from './update-prices-webhook'

const cryptoRoutes = Router()

// Webhook endpoint for external cron jobs (no JWT required, uses API key instead)
cryptoRoutes.post('/update-prices-webhook', updatePricesWebhook)

// All other routes require JWT authentication
cryptoRoutes.use(verifyJWT)

cryptoRoutes.get('/fixed-crypto-details', getAllFixedCryptoDetails)
cryptoRoutes.post('/populate-cache', populateFixedCryptoUseCase)

export { cryptoRoutes }
