import { createServer } from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { app } from './app'
import { env } from './env'
import { WebSocketService } from './services/websocket.service'

// Criar servidor HTTP
const server = createServer(app)

// Configurar Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.FRONTEND_URL || 'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
})

// Estender interface do Socket para incluir userId
declare module 'socket.io' {
  interface Socket {
    userId?: string;
  }
}

// Middleware de autenticação para WebSocket
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      console.log('❌ WebSocket connection rejected: No token provided')
      return next(new Error('Authentication error: No token provided'))
    }

    // Verificar o token JWT
    const decoded = jwt.verify(token, env.JWT_SECRET) as any
    socket.userId = decoded.sub || decoded.id // Adicionar ID do usuário ao socket
    
    console.log(`✅ WebSocket authenticated for user: ${socket.userId}`)
    next()
  } catch (error: any) {
    console.log('❌ WebSocket authentication failed:', error?.message || 'Unknown error')
    next(new Error('Authentication error: Invalid token'))
  }
})

// Inicializar serviço WebSocket
WebSocketService.initialize(io)

// Gerenciar conexões WebSocket
io.on('connection', (socket) => {
  console.log(`🟢 Client connected: ${socket.id} (User: ${socket.userId})`)
  

  socket.on('disconnect', () => {
    console.log(`🔴 Client disconnected: ${socket.id} (User: ${socket.userId})`)
  })
})

// Iniciar servidor
server.listen(env.PORT, () => {
  console.log(`🚀 HTTP Server Running on port ${env.PORT}!`)
  console.log(`⚡ WebSocket Server Ready!`)
})

// Exportar io para usar em outros arquivos
export { io }
