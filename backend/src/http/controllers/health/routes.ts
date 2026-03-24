import { Router, Request, Response } from 'express'

const router = Router()

// Simple health check endpoint for service monitoring
// This endpoint is useful for general health checks and monitoring
router.get('/', (request: Request, response: Response) => {
  return response.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'coin-trackr-backend',
  })
})

export { router as healthRoutes }
