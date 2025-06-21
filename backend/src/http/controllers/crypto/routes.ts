import { Router } from 'express'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { getAllFixedCryptoDetails } from './get-all-fixed-crypto-details'
import { populateFixedCryptoUseCase } from './populate-fixed-crypto-cache'

const cryptoRoutes = Router()

cryptoRoutes.use(verifyJWT)

cryptoRoutes.get('/fixed-crypto-details', getAllFixedCryptoDetails)
cryptoRoutes.post('/populate-cache', populateFixedCryptoUseCase)

export { cryptoRoutes }
