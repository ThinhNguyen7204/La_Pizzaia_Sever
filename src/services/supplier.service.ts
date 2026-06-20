import { ObjectId } from 'mongodb'
import Supplier from '~/database/models/supplier.model'
import {
  CreateSupplierBodyType,
  SupplierListResType,
  SupplierResType,
  UpdateSupplierBodyType
} from '~/schemaValidations/supplier.schema'
import { StatusError } from '~/utils/errors'

class SupplierService {
  async getSupplierList() {
    const list = await Supplier.collection.find().sort({ createdAt: -1 }).toArray()
    const formatted = list.map((s) => ({ ...s, _id: s._id.toString() }))
    return {
      data: formatted,
      message: 'Get supplier list successfully!'
    } as SupplierListResType
  }

  async getSupplierDetail(id: string) {
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Supplier not found', status: 404 })
    const supplier = await Supplier.collection.findOne({ _id: new ObjectId(id) })
    if (!supplier) throw new StatusError({ message: 'Supplier not found', status: 404 })
    return {
      data: { ...supplier, _id: supplier._id.toString() },
      message: 'Get supplier detail successfully!'
    } as SupplierResType
  }

  async createSupplier(data: CreateSupplierBodyType) {
    const now = new Date()
    const newSupplier = {
      ...data,
      phone: data.phone || null,
      rating: data.rating || null,
      supplier_name: data.supplier_name || null,
      supplier_address: data.supplier_address || null,
      email: data.email || null,
      description: data.description || null,
      createdAt: now,
      updatedAt: now
    }
    const result = await Supplier.collection.insertOne(newSupplier)
    return {
      data: { ...newSupplier, _id: result.insertedId.toString() },
      message: 'Create supplier successfully!'
    } as SupplierResType
  }

  async updateSupplier(id: string, data: UpdateSupplierBodyType) {
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Supplier not found', status: 404 })
    const supplier = await Supplier.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )
    if (!supplier) throw new StatusError({ message: 'Supplier not found', status: 404 })
    return {
      data: { ...supplier, _id: supplier._id.toString() },
      message: 'Update supplier successfully!'
    } as SupplierResType
  }

  async deleteSupplier(id: string) {
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Supplier not found', status: 404 })
    const supplier = await Supplier.collection.findOneAndDelete({ _id: new ObjectId(id) })
    if (!supplier) throw new StatusError({ message: 'Supplier not found', status: 404 })
    return {
      data: { ...supplier, _id: supplier._id.toString() },
      message: 'Delete supplier successfully!'
    } as SupplierResType
  }
}

const supplierService = new SupplierService()
export default supplierService
