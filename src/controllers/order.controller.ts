import orderService from '~/services/order.service'
import { Request, Response } from 'express'
import { CreateOrderBodyType, OrderParamsType, OrderQueryType, UpdateOrderBodyType } from '~/schemaValidations/order.schema'
import { getIO, ManagerRoom } from '~/libs/socket'
import Socket from '~/database/models/socket.model'
import databaseService from '~/database'
import { ObjectId } from 'mongodb'

const getGuestInfo = async (customerId: string | ObjectId) => {
  try {
    const customer = await databaseService.db
      .collection('customers')
      .findOne({ _id: new ObjectId(customerId) })
    if (customer) {
      const account = await databaseService.db
        .collection('accounts')
        .findOne({ _id: customer.account_id })
      if (account) {
        return {
          name: account.username,
          tableNumber: null
        }
      }
    }
  } catch (error) {
    console.error('Error getting guest info for socket:', error)
  }
  return {
    name: 'Customer',
    tableNumber: null
  }
}

export const getListOrderController = async (req: Request, res: Response) => {
  const { data, message } = await orderService.getListOrder(req.query as OrderQueryType)
  return res.json({
    message,
    data
  })
}

export const getDetailOrderController = async (req: Request, res: Response) => {
  const { data, message } = await orderService.getDetailOrder(req.params as OrderParamsType)
  return res.json({
    message,
    data
  })
}

export const createOrderController = async (req: Request, res: Response) => {
  const { data, message } = await orderService.addOrder(req.body as CreateOrderBodyType)
  
  // Realtime Socket.IO emission
  if (data) {
    try {
      const io = getIO()
      const customerId = data.customer_id
      const guest = await getGuestInfo(customerId)
      
      // Tạo cấu trúc món ăn dishSnapshot tương thích với frontend client mong đợi (từ items[0] tạm thời)
      const firstItem = data.items && data.items[0]
      const socketOrderData = {
        ...data,
        guest,
        dishSnapshot: {
          name: firstItem ? firstItem.product_name : 'Pizza',
          price: firstItem ? firstItem.price : 0
        },
        quantity: firstItem ? firstItem.quantity : 1
      }

      const socketRecord = await Socket.collection.findOne({ guestId: new ObjectId(customerId) })
      if (socketRecord?.socketId) {
        io.to(ManagerRoom).to(socketRecord.socketId).emit('new-order', [socketOrderData])
      } else {
        io.to(ManagerRoom).emit('new-order', [socketOrderData])
      }
    } catch (error) {
      console.error('Socket new-order emit failed:', error)
    }
  }

  return res.json({
    message,
    data
  })
}

export const updateOrderController = async (req: Request, res: Response) => {
  const { data, message } = await orderService.updateOrder(
    req.params as OrderParamsType,
    req.body as UpdateOrderBodyType
  )

  // Realtime Socket.IO emission
  if (data) {
    try {
      const io = getIO()
      const customerId = data.customer_id
      const guest = await getGuestInfo(customerId)
      
      const firstItem = data.items && data.items[0]
      const socketOrderData = {
        ...data,
        guest,
        dishSnapshot: {
          name: firstItem ? firstItem.product_name : 'Pizza',
          price: firstItem ? firstItem.price : 0
        },
        quantity: firstItem ? firstItem.quantity : 1
      }

      const socketRecord = await Socket.collection.findOne({ guestId: new ObjectId(customerId) })
      
      // 1. Phát sự kiện update-order
      if (socketRecord?.socketId) {
        io.to(socketRecord.socketId).to(ManagerRoom).emit('update-order', socketOrderData)
      } else {
        io.to(ManagerRoom).emit('update-order', socketOrderData)
      }

      // 2. Phát sự kiện payment nếu đơn hàng được cập nhật sang Paid (Đã thanh toán)
      if (data.status === 'Paid') {
        if (socketRecord?.socketId) {
          io.to(socketRecord.socketId).to(ManagerRoom).emit('payment', [socketOrderData])
        } else {
          io.to(ManagerRoom).emit('payment', [socketOrderData])
        }
      }
    } catch (error) {
      console.error('Socket update-order/payment emit failed:', error)
    }
  }

  return res.json({
    message,
    data
  })
}
