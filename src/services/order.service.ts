import { ObjectId } from 'mongodb'
import Order from '~/database/models/order.model'
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
    const order = await Order.collection.find(filter).sort({ createdAt: -1 }).toArray()
    return {
      message: 'Get order list successfully',
      data: order
    } as OrderListResType
  }

  async getDetailOrder(params: OrderParamsType) {
    const { id } = params
    if (ObjectId.isValid(params.id)) throw new StatusError({ message: 'Order does not exist', status: 404 })
    const order = await Order.collection.findOne({ _id: new ObjectId(id) })
    return {
      message: 'Get order detail successfully',
      data: order
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
      loyalty_program_id: body.loyalty_program_id ? new ObjectId(body.loyalty_program_id) : null
    }
    const order = await Order.collection.insertOne(newOrder)
    return {
      message: 'Create order successfully',
      data: { _id: order.insertedId, ...order }
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
