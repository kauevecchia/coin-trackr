import { createServer } from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { app } from './app'
import { env } from './env'
import { WebSocketService } from './services/websocket.service'
import { PriceUpdaterCron } from './cron/price-updater'

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://coin-trackr-gamma.vercel.app',
      process.env.FRONTEND_URL || 'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
})

declare module 'socket.io' {
  interface Socket {
    userId?: string;
  }
}

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      console.log('❌ WebSocket connection rejected: No token provided')
      return next(new Error('Authentication error: No token provided'))
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as any
    socket.userId = decoded.sub || decoded.id
    
    console.log(`✅ WebSocket authenticated for user: ${socket.userId}`)
    next()
  } catch (error: any) {
    console.log('❌ WebSocket authentication failed:', error?.message || 'Unknown error')
    next(new Error('Authentication error: Invalid token'))
  }
})

WebSocketService.initialize(io)

io.on('connection', (socket) => {
  console.log(`🟢 Client connected: ${socket.id} (User: ${socket.userId})`)
  console.log(`🔍 Connection details:`, {
    id: socket.id,
    userId: socket.userId,
    handshake: {
      headers: socket.handshake.headers,
      auth: socket.handshake.auth,
      address: socket.handshake.address,
      time: socket.handshake.time
    }
  })

  socket.on('disconnect', (reason) => {
    console.log(`🔴 Client disconnected: ${socket.id} (User: ${socket.userId}) - Reason: ${reason}`)
  })
})

server.listen(env.PORT, () => {
  console.log(`🚀 HTTP Server Running on port ${env.PORT}!`)
  console.log(`⚡ WebSocket Server Ready!`)
  
  PriceUpdaterCron.start()
})

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down gracefully...')
  PriceUpdaterCron.stop()
  server.close()
})

process.on('SIGINT', () => {
  console.log('🛑 Shutting down gracefully...')
  PriceUpdaterCron.stop()
  server.close()
})

export { io }
