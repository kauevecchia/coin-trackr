import { Server } from 'socket.io'

export class WebSocketService {
  private static io: Server

  static initialize(io: Server) {
    this.io = io
    console.log('📡 WebSocket service initialized')
  }

  // broadcast when prices are updated
  static broadcastPriceUpdate() {
    if (!this.io) {
      console.warn('⚠️ WebSocket not initialized, skipping broadcast')
      return
    }

    const timestamp = new Date().toISOString()
    console.log(`📢 Broadcasting price update at ${timestamp}`)
    
    this.io.emit('crypto-prices-updated', {
      message: 'Cryptocurrency prices have been updated',
      timestamp,
    })
  }

  static broadcast(event: string, data: any) {
    if (!this.io) {
      console.warn(`⚠️ WebSocket not initialized, skipping broadcast for event: ${event}`)
      return
    }

    this.io.emit(event, data)
  }
}