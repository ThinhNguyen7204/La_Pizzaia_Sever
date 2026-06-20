import { ObjectId } from 'mongodb'
import Cart from '~/database/models/cart.model'
import Product from '~/database/models/product.model'
import {
  AddToCartBodyType,
  CartItemParamsType,
  CartResType,
  UpdateCartItemBodyType
} from '~/schemaValidations/cart.schema'
import { StatusError } from '~/utils/errors'

class CartService {
  populateCartItems = async (cart: any) => {
    if (!cart || !cart.items || cart.items.length === 0) return cart
    const productIds = cart.items.map((i: any) => i.product_id)
    const products = await Product.collection.find({ _id: { $in: productIds } }).toArray()
    cart.items = cart.items.map((item: any) => {
      const p = products.find((p) => p._id!.toString() === item.product_id.toString())
      return { ...item, product_id: p || item.product_id }
    })
    return cart
  }

  async getCart(customerId: string) {
    if (!ObjectId.isValid(customerId)) throw new StatusError({ message: 'User does not exist', status: 400 })
    let cart = await Cart.collection.findOne({ customer_id: new ObjectId(customerId) })
    if (!cart) {
      const now = new Date()
      const newCart = {
        customer_id: new ObjectId(customerId),
        items: [],
        subTotal: 0,
        discountAmount: 0,
        discountLytP: 0,
        finalPrice: 0,
        voucher_id: null,
        loyalty_program_id: null,
        createdAt: now,
        updatedAt: now
      }
      const result = await Cart.collection.insertOne(newCart)
      cart = { ...newCart, _id: result.insertedId }
    }
    return {
      data: await this.populateCartItems(cart),
      message: 'Get cart successfully'
    } as CartResType
  }

  async addToCart(customerId: string, body: AddToCartBodyType) {
    const { product_id, quantity } = body
    if (!ObjectId.isValid(customerId) || !ObjectId.isValid(product_id)) {
      throw new StatusError({ message: 'Information invalid', status: 400 })
    }
    const product = await Product.collection.findOne({ _id: new ObjectId(product_id) })
    if (!product) throw new StatusError({ message: 'Product does not exist', status: 404 })

    let cart = await Cart.collection.findOne({ customer_id: new ObjectId(customerId) })
    if (!cart) {
      const now = new Date()
      const newCart = {
        customer_id: new ObjectId(customerId),
        items: [],
        subTotal: 0,
        discountAmount: 0,
        discountLytP: 0,
        finalPrice: 0,
        voucher_id: null,
        loyalty_program_id: null,
        createdAt: now,
        updatedAt: now
      }
      const result = await Cart.collection.insertOne(newCart)
      cart = { ...newCart, _id: result.insertedId }
    }

    const existingItem = cart.items.find((item: any) => item.product_id.toString() === product_id)
    if (existingItem) {
      existingItem.quantity += quantity
      existingItem.price = product.price
    } else {
      cart.items.push({ _id: new ObjectId(), product_id: product._id!, quantity, price: product.price })
    }

    cart.subTotal = cart.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    cart.finalPrice = cart.subTotal - cart.discountAmount - cart.discountLytP

    await Cart.collection.updateOne(
      { _id: cart._id },
      { $set: { items: cart.items, subTotal: cart.subTotal, finalPrice: cart.finalPrice, updatedAt: new Date() } }
    )

    return {
      data: await this.populateCartItems(cart),
      message: 'Add to cart successfully'
    } as CartResType
  }

  async updateCartItem(customerId: string, param: CartItemParamsType, body: UpdateCartItemBodyType) {
    const { itemId } = param
    const { quantity } = body
    if (!ObjectId.isValid(customerId) || !ObjectId.isValid(itemId)) {
      throw new StatusError({ message: 'Information invalid', status: 400 })
    }
    const cart = await Cart.collection.findOne({ customer_id: new ObjectId(customerId) })
    if (!cart) throw new StatusError({ message: 'Cart does not exist', status: 404 })

    const item = cart.items.find((i) => i._id && i._id.toString() === itemId)
    if (!item) throw new StatusError({ message: 'Product does not exist in cart', status: 404 })

    item.quantity = quantity
    cart.subTotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    cart.finalPrice = cart.subTotal - cart.discountAmount - cart.discountLytP

    await Cart.collection.updateOne(
      { _id: cart._id },
      { $set: { items: cart.items, subTotal: cart.subTotal, finalPrice: cart.finalPrice, updatedAt: new Date() } }
    )
    return {
      data: cart,
      message: 'Update cart successfully'
    } as CartResType
  }

  async removeCartItem(customerId: string, param: CartItemParamsType) {
    const { itemId } = param
    if (!ObjectId.isValid(customerId) || !ObjectId.isValid(itemId)) {
      throw new StatusError({ message: 'Information invalid', status: 400 })
    }
    const cart = await Cart.collection.findOne({ customer_id: new ObjectId(customerId) })
    if (!cart) throw new StatusError({ message: 'Cart does not exist', status: 404 })

    cart.items = cart.items.filter((i) => !i._id || i._id.toString() !== itemId)
    cart.subTotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    cart.finalPrice = cart.subTotal - cart.discountAmount - cart.discountLytP

    await Cart.collection.updateOne(
      { _id: cart._id },
      { $set: { items: cart.items, subTotal: cart.subTotal, finalPrice: cart.finalPrice, updatedAt: new Date() } }
    )
    return {
      data: cart,
      message: 'Remove cart successfully'
    } as CartResType
  }

  async clearCart(customerId: string) {
    if (!ObjectId.isValid(customerId)) throw new StatusError({ message: 'User does not exist', status: 404 })
    const cart = await Cart.collection.findOneAndUpdate(
      { customer_id: new ObjectId(customerId) },
      {
        $set: {
          items: [],
          subTotal: 0,
          discountAmount: 0,
          discountLytP: 0,
          finalPrice: 0,
          voucher_id: null,
          loyalty_program_id: null,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )
    return {
      data: cart,
      message: 'Clear cart successfully'
    } as CartResType
  }
}

const cartService = new CartService()
export default cartService
