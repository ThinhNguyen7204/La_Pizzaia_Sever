import { ObjectId } from 'mongodb'
import databaseService from '~/database'

export interface IVoucher {
  _id?: ObjectId
  code: string
  description?: string | null
  discount_type: string
  discount_value: number
  min_order_value: number
  max_discount: number
  start_date: Date
  end_date: Date
  usage_limit: number
  used_count: number
  is_active: boolean
  createdAt?: Date
  updatedAt?: Date
}

class VoucherModel {
  get collection() {
    return databaseService.db.collection<IVoucher>('vouchers')
  }
}

const Voucher = new VoucherModel()
export default Voucher
