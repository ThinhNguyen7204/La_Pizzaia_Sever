import { ObjectId } from 'mongodb'
import databaseService from '~/database'

export interface IProduct {
  _id?: ObjectId
  product_name: string
  image?: string | null
  description?: string | null
  size?: string | null
  price: number
  menu_name?: string | null
  status: string
  createdAt?: Date
  updatedAt?: Date
}

class ProductModel {
  get collection() {
    return databaseService.db.collection<IProduct>('products')
  }
}

const Product = new ProductModel()
export default Product
