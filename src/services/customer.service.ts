import { ObjectId } from 'mongodb'
import databaseService from '~/database'
import Customer from '~/database/models/customer.model'
import {
  CreateCustomerBodyType,
  CustomerListResType,
  CustomerResType,
  UpdateCustomerBodyType
} from '~/schemaValidations/customer.schema'
import { StatusError } from '~/utils/errors'

class CustomerService {
  async getCustomerList() {
    const customers = await Customer.collection
      .aggregate([
        {
          $lookup: {
            from: 'accounts',
            localField: 'account_id',
            foreignField: '_id',
            as: 'account'
          }
        },
        { $unwind: { path: '$account', preserveNullAndEmptyArrays: true } },
        { $unset: 'account.password' },
        { $sort: { createdAt: -1 } }
      ])
      .toArray()
    const formatted = customers.map((c) => ({
      ...c,
      _id: c._id.toString(),
      account_id: c.account_id ? c.account_id.toString() : null
    }))
    return {
      data: formatted,
      message: 'Get customer list successfully!'
    } as CustomerListResType
  }

  async getCustomerDetail(id: string) {
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Customer not found', status: 404 })
    const results = await Customer.collection
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: 'accounts',
            localField: 'account_id',
            foreignField: '_id',
            as: 'account'
          }
        },
        { $unwind: { path: '$account', preserveNullAndEmptyArrays: true } },
        { $unset: 'account.password' }
      ])
      .toArray()

    if (results.length === 0) throw new StatusError({ message: 'Customer not found', status: 404 })
    const customer = results[0]
    return {
      data: {
        ...customer,
        _id: customer._id.toString(),
        account_id: customer.account_id ? customer.account_id.toString() : null
      },
      message: 'Get customer detail successfully!'
    } as CustomerResType
  }

  async createCustomer(data: CreateCustomerBodyType) {
    const now = new Date()
    const newCustomer = {
      ...data,
      account_id: new ObjectId(data.account_id),
      loyalty_points: data.loyalty_points || 0,
      createdAt: now,
      updatedAt: now
    }
    const result = await Customer.collection.insertOne(newCustomer)
    return {
      data: { ...newCustomer, _id: result.insertedId.toString() },
      message: 'Create customer successfully!'
    } as CustomerResType
  }

  async updateCustomer(id: string, data: UpdateCustomerBodyType) {
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Customer not found', status: 404 })

    const updateData: any = { ...data, updatedAt: new Date() }
    if (data.account_id) updateData.account_id = new ObjectId(data.account_id)

    const customer = await Customer.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    if (!customer) throw new StatusError({ message: 'Customer not found', status: 404 })

    const account = await databaseService.db
      .collection('accounts')
      .findOne({ _id: customer.account_id }, { projection: { password: 0 } })
    
    return {
      data: {
        ...customer,
        _id: customer._id.toString(),
        account_id: account || customer.account_id
      },
      message: 'Update customer successfully!'
    } as CustomerResType
  }

  async deleteCustomer(id: string) {
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Customer not found', status: 404 })
    const customer = await Customer.collection.findOneAndDelete({ _id: new ObjectId(id) })
    if (!customer) throw new StatusError({ message: 'Customer not found', status: 404 })
    return {
      data: { ...customer, _id: customer._id.toString() },
      message: 'Delete customer successfully!'
    } as CustomerResType
  }
}

const customerService = new CustomerService()
export default customerService
