import { Router } from 'express'
import { updatePrices } from './update-prices'
import { getCronStats, triggerManualUpdate } from './cron-control'
import { requireApiKey } from '@/http/middlewares/api-key-auth'

const router = Router()

// apply api key middleware to all admin routes
router.use(requireApiKey)

router.post('/update-prices', updatePrices)
router.get('/cron/stats', getCronStats)
router.post('/cron/trigger', triggerManualUpdate)

export { router as adminRoutes }