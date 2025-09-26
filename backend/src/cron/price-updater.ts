import cron from 'node-cron'
import { WebSocketService } from '@/services/websocket.service'
import { makePopulateFixedCryptoCacheUseCase } from '@/use-cases/factories/make-populate-fixed-crypto-cache-use-case'

export class PriceUpdaterCron {
  private static isRunning = false
  private static lastRun: Date | null = null
  private static runCount = 0
  private static cronJob: cron.ScheduledTask | null = null

  static start() {
    const schedule = process.env.CRON_SCHEDULE || '*/5 * * * *'
    const timezone = process.env.CRON_TIMEZONE || 'America/Sao_Paulo'
    const enabled = process.env.CRON_ENABLED !== 'false'

    if (!enabled) {
      console.log('⏸️ Cron job disabled by environment variable')
      return
    }

    this.cronJob = cron.schedule(schedule, async () => {
      if (this.isRunning) {
        console.log('⏭️ Price update already running, skipping...')
        return
      }

      this.isRunning = true
      this.runCount++
      const startTime = new Date()
      
      console.log(`🔄 Cron run #${this.runCount} started at ${startTime.toISOString()}`)

      try {
        const populateCryptoCacheUseCase = makePopulateFixedCryptoCacheUseCase()
        await populateCryptoCacheUseCase.execute()
        
        WebSocketService.broadcastPriceUpdate()
        
        const duration = Date.now() - startTime.getTime()
        console.log(`✅ Cron run #${this.runCount} completed in ${duration}ms`)
        
        this.lastRun = startTime
      } catch (error) {
        console.error(`❌ Cron run #${this.runCount} failed:`, error)
      } finally {
        this.isRunning = false
      }
    }, {
      scheduled: true,
      timezone
    })

    console.log('✅ Price updater cron job started successfully')
  }

  static stop() {
    if (this.cronJob) {
      this.cronJob.destroy()
      this.cronJob = null
      console.log('⏹️ Price updater cron job stopped')
    }
  }

  static getStats() {
    return {
      isRunning: this.isRunning,
      lastRun: this.lastRun,
      runCount: this.runCount,
      schedule: process.env.CRON_SCHEDULE || '*/5 * * * *',
      timezone: process.env.CRON_TIMEZONE || 'America/Sao_Paulo',
      enabled: process.env.CRON_ENABLED !== 'false'
    }
  }

  static async triggerManualUpdate() {
    if (this.isRunning) {
      throw new Error('Price update is already running')
    }

    this.isRunning = true
    this.runCount++
    const startTime = new Date()
    
    console.log(`🔄 Manual trigger update #${this.runCount} started at ${startTime.toISOString()}`)

    try {
      const populateCryptoCacheUseCase = makePopulateFixedCryptoCacheUseCase()
      await populateCryptoCacheUseCase.execute()
      
      WebSocketService.broadcastPriceUpdate()
      
      const duration = Date.now() - startTime.getTime()
      console.log(`✅ Manual trigger update #${this.runCount} completed in ${duration}ms`)
      
      this.lastRun = startTime
      return { success: true, duration, timestamp: startTime }
    } catch (error) {
      console.error(`❌ Manual trigger update #${this.runCount} failed:`, error)
      throw error
    } finally {
      this.isRunning = false
    }
  }
}