import { ObjectId } from 'mongodb'
import databaseService from '~/database'

export interface IOrderItem {
  product_id: ObjectId
  product_name: string
  price: number
  quantity: number
}

export interface IOrder {
  _id?: ObjectId
  order_date: Date
  bonus_point: number
  paid: number
  delivery_type: string
  payment_code?: number | null
  ship_code?: number | null
  customer_id: ObjectId
  status: string
  address?: string | null
  orderTotal: number
  discountAmount: number
  discountLytP: number
  finalPrice: number
  voucher_id?: ObjectId | null
  loyalty_program_id?: ObjectId | null
  items: IOrderItem[]
  createdAt?: Date
  updatedAt?: Date
}

class OrderModel {
  get collection() {
    return databaseService.db.collection<IOrder>('orders')
  }
}

const Order = new OrderModel()
export default Order
