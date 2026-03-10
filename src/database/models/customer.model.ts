import { ObjectId } from 'mongodb'
import databaseService from '~/database'

export interface ICustomer {
  _id?: ObjectId
  customer_id: string
  account_id: ObjectId
  loyalty_points: number
  createdAt?: Date
  updatedAt?: Date
}

class CustomerModel {
  get collection() {
    return databaseService.db.collection<ICustomer>('customers')
  }
}

const Customer = new CustomerModel()
export default Customer
