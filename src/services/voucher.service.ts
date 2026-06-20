import { ObjectId } from 'mongodb'
import Voucher from '~/database/models/voucher.model'
import {
  CreateVoucherBodyType,
  UpdateVoucherBodyType,
  ValidateVoucherBodyType,
  VoucherListResType,
  VoucherResType
} from '~/schemaValidations/voucher.schema'
import { StatusError } from '~/utils/errors'

class VoucherService {
  async getVoucherList() {
    const list = await Voucher.collection.find().sort({ createdAt: -1 }).toArray()
    const formatted = list.map((v) => ({ ...v, _id: v._id.toString() }))
    return {
      data: formatted,
      message: 'Get voucher list successfully!'
    } as VoucherListResType
  }

  async getVoucherDetail(id: string) {
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Voucher not found', status: 404 })
    const voucher = await Voucher.collection.findOne({ _id: new ObjectId(id) })
    if (!voucher) throw new StatusError({ message: 'Voucher not found', status: 404 })
    return {
      data: { ...voucher, _id: voucher._id.toString() },
      message: 'Get voucher detail successfully!'
    } as VoucherResType
  }

  async createVoucher(data: CreateVoucherBodyType) {
    const now = new Date()
    const newVoucher = {
      ...data,
      code: data.code.toUpperCase(),
      description: data.description || null,
      min_order_value: data.min_order_value !== undefined ? data.min_order_value : 0,
      max_discount: data.max_discount !== undefined ? data.max_discount : 0,
      usage_limit: data.usage_limit !== undefined ? data.usage_limit : 0,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      used_count: 0,
      is_active: data.is_active !== undefined ? data.is_active : true,
      createdAt: now,
      updatedAt: now
    }
    const result = await Voucher.collection.insertOne(newVoucher)
    return {
      data: { ...newVoucher, _id: result.insertedId.toString() },
      message: 'Create voucher successfully!'
    } as VoucherResType
  }

  async updateVoucher(id: string, data: UpdateVoucherBodyType) {
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Voucher not found', status: 404 })
    const updateData: any = { ...data, updatedAt: new Date() }
    if (data.start_date) updateData.start_date = new Date(data.start_date)
    if (data.end_date) updateData.end_date = new Date(data.end_date)

    const voucher = await Voucher.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    if (!voucher) throw new StatusError({ message: 'Voucher not found', status: 404 })
    return {
      data: { ...voucher, _id: voucher._id.toString() },
      message: 'Update voucher successfully!'
    } as VoucherResType
  }

  async deleteVoucher(id: string) {
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Voucher not found', status: 404 })
    const voucher = await Voucher.collection.findOneAndDelete({ _id: new ObjectId(id) })
    if (!voucher) throw new StatusError({ message: 'Voucher not found', status: 404 })
    return {
      data: { ...voucher, _id: voucher._id.toString() },
      message: 'Delete voucher successfully!'
    } as VoucherResType
  }

  async validateVoucher(body: ValidateVoucherBodyType) {
    const { code } = body
    const voucher = await Voucher.collection.findOne({ code: code.toUpperCase(), is_active: true })
    if (!voucher) throw new StatusError({ message: 'Invalid voucher', status: 400 })
    const now = new Date()
    if (now < voucher.start_date || now > voucher.end_date) {
      throw new StatusError({ message: 'Voucher has expired', status: 400 })
    }
    if (voucher.usage_limit > 0 && voucher.used_count >= voucher.usage_limit) {
      throw new StatusError({ message: 'Voucher usage limit exceeded', status: 400 })
    }
    return {
      data: { ...voucher, _id: voucher._id.toString() },
      message: 'Voucher is valid!'
    } as VoucherResType
  }
}

const voucherService = new VoucherService()
export default voucherService
