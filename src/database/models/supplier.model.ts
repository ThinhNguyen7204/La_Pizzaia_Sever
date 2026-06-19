import { ObjectId } from 'mongodb'
import databaseService from '~/database'

export interface ISupplier {
  _id?: ObjectId
  phone?: string | null
  rating?: number | null
  supplier_name?: string | null
  supplier_address?: string | null
  email?: string | null
  description?: string | null
  createdAt?: Date
  updatedAt?: Date
}

class SupplierModel {
  get collection() {
    return databaseService.db.collection<ISupplier>('suppliers')
  }
}

const Supplier = new SupplierModel()
export default Supplier
