import { Request, Response, NextFunction } from 'express'
import { env } from '@/env'

export const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
  try {
    // verify if there is an api key in the header
    const apiKey = req.headers['x-api-key'] as string
    
    if (!apiKey) {
      return res.status(401).json({
        error: 'Access denied. API key required.',
        message: 'Please provide a valid API key in X-API-Key header'
      })
    }

    // verify if the api key is correct
    const validApiKey = env.ADMIN_API_KEY
    
    if (apiKey !== validApiKey) {
      return res.status(403).json({
        error: 'Access denied. Invalid API key.',
        message: 'The provided API key is not valid'
      })
    }

    console.log(`🔐 Admin API access granted with key: ${apiKey.substring(0, 8)}...`)
    next()
  } catch (error) {
    console.error('❌ API key authentication failed:', error)
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Please provide a valid API key'
    })
  }
}