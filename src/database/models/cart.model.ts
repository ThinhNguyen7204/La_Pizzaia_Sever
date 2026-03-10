import { ObjectId } from 'mongodb'
import databaseService from '~/database'

export interface ICartItem {
  _id?: ObjectId
  product_id: ObjectId
  quantity: number
  price: number
}

export interface ICart {
  _id?: ObjectId
  customer_id: ObjectId
  subTotal: number
  discountAmount: number
  voucher_id?: ObjectId | null
  discountLytP: number
  finalPrice: number
  loyalty_program_id?: ObjectId | null
  items: ICartItem[]
  createdAt?: Date
  updatedAt?: Date
}

class CartModel {
  get collection() {
    return databaseService.db.collection<ICart>('carts')
  }
}

const Cart = new CartModel()
export default Cart
