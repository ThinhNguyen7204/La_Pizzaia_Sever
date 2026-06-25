import { ObjectId } from 'mongodb'
import Order from '~/database/models/order.model'
import databaseService from '~/database'
import {
  CreateOrderBodyType,
  OrderListResType,
  OrderParamsType,
  OrderQueryType,
  OrderResType,
  UpdateOrderBodyType
} from '~/schemaValidations/order.schema'
import { StatusError } from '~/utils/errors'

class OrderService {
  async getListOrder(query: OrderQueryType) {
    const filter: any = {}
    if (query.customer_id) {
      filter.customer_id = ObjectId.isValid(query.customer_id) ? new ObjectId(query.customer_id) : query.customer_id
    }
    if (query.status) filter.status = query.status
    const orders = await Order.collection
      .aggregate([
        { $match: filter },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: 'customers',
            localField: 'customer_id',
            foreignField: '_id',
            as: 'customer_info'
          }
        },
        {
          $unwind: {
            path: '$customer_info',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'accounts',
            localField: 'customer_info.account_id',
            foreignField: '_id',
            as: 'account_info'
          }
        },
        {
          $unwind: {
            path: '$account_info',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            customer_name: { $ifNull: ['$account_info.username', 'Khách hàng'] }
          }
        },
        {
          $project: {
            customer_info: 0,
            account_info: 0
          }
        }
      ])
      .toArray()
    return {
      message: 'Get order list successfully',
      data: orders
    } as OrderListResType
  }

  async getDetailOrder(params: OrderParamsType) {
    const { id } = params
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Order does not exist', status: 404 })
    const order = await Order.collection.findOne({ _id: new ObjectId(id) })
    if (!order) throw new StatusError({ message: 'Order does not exist', status: 404 })
    
    let customer_name = 'Khách hàng'
    if (order.customer_id) {
      const customer = await databaseService.db.collection('customers').findOne({ _id: order.customer_id })
      if (customer) {
        const account = await databaseService.db.collection('accounts').findOne({ _id: customer.account_id })
        if (account) {
          customer_name = account.username
        }
      }
    }
    
    return {
      message: 'Get order detail successfully',
      data: { ...order, customer_name }
    } as OrderResType
  }

  async addOrder(data: CreateOrderBodyType) {
    const body: any = data
    const now = new Date()
    const newOrder = {
      ...body,
      order_date: now,
      bonus_point: body.bonus_point !== undefined ? body.bonus_point : 0,
      paid: body.paid !== undefined ? body.paid : 0,
      payment_code: body.payment_code || null,
      ship_code: body.ship_code || null,
      customer_id: new ObjectId(data.customer_id),
      status: body.status || 'Pending',
      address: data.address || null,
      orderTotal: body.orderTotal || 0,
      discountAmount: data.discountAmount || 0,
      discountLytP: body.discountLytP || 0,
      finalPrice: body.finalPrice || 0,
      voucher_id: data.voucher_id ? new ObjectId(data.voucher_id) : null,
      loyalty_program_id: body.loyalty_program_id ? new ObjectId(body.loyalty_program_id) : null,
      items: data.items.map((item: any) => ({
        ...item,
        product_id: new ObjectId(item.product_id)
      })),
      createdAt: now,
      updatedAt: now
    }
    const order = await Order.collection.insertOne(newOrder)
    return {
      message: 'Create order successfully',
      data: { ...newOrder, _id: order.insertedId }
    }
  }

  async updateOrder(params: OrderParamsType, body: UpdateOrderBodyType) {
    const { id } = params
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Order does not exist', status: 404 })
    const updateData: any = { ...body, updatedAt: new Date() }
    if (updateData.customer_id && typeof updateData.customer_id === 'string') {
      updateData.customer_id = new ObjectId(updateData.customer_id)
    }
    const order = await Order.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return {
      message: 'Update order successfully',
      data: order
    }
  }
}

const orderService = new OrderService()
export default orderService
