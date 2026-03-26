import { ObjectId } from 'mongodb'
import { de } from 'zod/v4/locales'
import Product from '~/database/models/product.model'
import {
  CreateProductBodyType,
  ProductListResType,
  ProductResType,
  UpdateProductBodyType
} from '~/schemaValidations/product.schema'
import { StatusError } from '~/utils/errors'

class ProductService {
  async getProductList() {
    const product = await Product.collection.find().sort({ createdAt: -1 }).toArray()
    const formattedData = product.map((p) => ({ ...p, _id: p._id.toString() }))
    return {
      data: formattedData,
      message: 'Get product list successfully'
    } as ProductListResType
  }

  async getDetailProduct(productId: string) {
    if (!ObjectId.isValid(productId)) throw new StatusError({ message: 'Product does not exist', status: 404 })
    const product = await Product.collection.findOne({ _id: new ObjectId(productId) })
    if (!product) throw new StatusError({ message: 'Product does not exist', status: 404 })
    return {
      data: { id: product._id.toString(), ...product },
      message: 'Get product detail successfully'
    } as ProductResType
  }

  async createProduct(body: CreateProductBodyType) {
    const now = new Date()
    const newProduct = {
      ...body,
      image: body.image || null,
      description: body.description || null,
      size: body.size || null,
      menu_name: body.menu_name || null,
      status: body.status || 'Available',
      createdAt: now,
      updatedAt: now
    }
    const product = await Product.collection.insertOne(newProduct)
    return {
      data: { _id: product.insertedId.toString(), ...newProduct },
      message: 'Create product successfully'
    } as ProductResType
  }

  async updateProduct(productId: string, body: UpdateProductBodyType) {
    if (!ObjectId.isValid(productId)) throw new StatusError({ message: 'Product does not exist', status: 404 })
    const updatedProduct = await Product.collection.findOneAndUpdate(
      { _id: new ObjectId(productId) },
      { $set: { ...body, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )
    if (!updatedProduct) throw new StatusError({ message: 'Product does not exist', status: 404 })
    return {
      data: updatedProduct,
      message: 'Update product successfully'
    } as ProductResType
  }

  async deleteProduct(productId: string) {
    if (!ObjectId.isValid(productId)) throw new StatusError({ message: 'Product does not exist', status: 404 })
    const deletedProduct = await Product.collection.findOneAndDelete({ _id: new ObjectId(productId) })
    if (!deletedProduct) throw new StatusError({ message: 'Product does not exist', status: 404 })
    return {
      data: deletedProduct,
      message: 'Delete product successfully'
    } as ProductResType
  }
}
const productService = new ProductService()
export default productService
