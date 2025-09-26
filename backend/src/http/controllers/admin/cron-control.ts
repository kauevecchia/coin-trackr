import { Request, Response } from 'express'
import { PriceUpdaterCron } from '@/cron/price-updater'

export async function getCronStats(request: Request, response: Response) {
  try {
    const stats = PriceUpdaterCron.getStats()
    return response.status(200).json({
      message: 'Cron job statistics retrieved successfully',
      stats
    })
  } catch (error) {
    console.error('❌ Error getting cron stats:', error)
    return response.status(500).json({
      error: 'Failed to get cron statistics',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export async function triggerManualUpdate(request: Request, response: Response) {
  try {
    console.log('🚀 Starting manual trigger of price update...')
    
    const result = await PriceUpdaterCron.triggerManualUpdate()
    
    console.log('✅ Manual trigger of price update completed successfully')
    
    return response.status(200).json({
      message: 'Manual trigger of price update completed successfully',
      result
    })
  } catch (error) {
    console.error('❌ Error in manual trigger of price update:', error)
    
    return response.status(500).json({
      error: 'Failed to execute manual trigger of price update',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}