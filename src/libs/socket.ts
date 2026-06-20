import { Server } from 'socket.io'
import http from 'http'
import { ObjectId } from 'mongodb'
import { Role } from '~/constants/type'
import { verifyAccessToken } from '~/utils/jwt'
import Socket from '~/database/models/socket.model'
import { getChalk } from '~/utils/helpers'
import { AuthError } from '~/utils/errors'

export const ManagerRoom = 'ManagerRoom'

let io: Server | null = null

export const initSocket = (httpServer: http.Server) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*', // Cho phép mọi nguồn kết nối (hoặc có thể cấu hình chi tiết)
      credentials: true
    }
  })

  // Middleware xác thực token qua Socket.IO Handshake
  io.use(async (socket, next) => {
    const { Authorization } = socket.handshake.auth
    if (!Authorization) {
      return next(new AuthError('Authorization header not found'))
    }

    const accessToken = Authorization.split(' ')[1]
    if (!accessToken) {
      return next(new AuthError('Access token not found'))
    }

    try {
      const decodedAccessToken = verifyAccessToken(accessToken)
      const { userId, role } = decodedAccessToken

      if (role === Role.Customer) {
        // Lưu/cập nhật liên kết guest (Customer) với socketId
        await Socket.collection.updateOne(
          { guestId: new ObjectId(userId) },
          {
            $set: { socketId: socket.id, updatedAt: new Date() },
            $setOnInsert: { createdAt: new Date(), accountId: null }
          },
          { upsert: true }
        )
      } else {
        // Lưu/cập nhật liên kết account (Admin/Staff) với socketId
        await Socket.collection.updateOne(
          { accountId: new ObjectId(userId) },
          {
            $set: { socketId: socket.id, updatedAt: new Date() },
            $setOnInsert: { createdAt: new Date(), guestId: null }
          },
          { upsert: true }
        )
        // Gia nhập phòng quản lý dành cho nhân viên
        socket.join(ManagerRoom)
      }

      socket.handshake.auth.decodedAccessToken = decodedAccessToken
      next()
    } catch (error: any) {
      return next(new AuthError('Invalid access token'))
    }
  })

  io.on('connection', async (socket) => {
    const chalk = await getChalk()
    console.log(chalk.cyanBright(`Socket connected: ${socket.id}`))

    socket.on('disconnect', async () => {
      // Xóa ánh xạ socketId khỏi database khi ngắt kết nối
      await Socket.collection.deleteOne({ socketId: socket.id })
      console.log(chalk.redBright(`Socket disconnected: ${socket.id}`))
    })
  })

  return io
}

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO is not initialized')
  }
  return io
}
