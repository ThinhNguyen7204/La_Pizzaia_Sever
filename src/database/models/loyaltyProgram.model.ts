import { ObjectId } from 'mongodb'
import databaseService from '~/database'

export interface ILoyaltyProgram {
  _id?: ObjectId
  name: string
  description?: string | null
  points_required: number
  discount_type: string
  discount_value: number
  is_active: boolean
  createdAt?: Date
  updatedAt?: Date
}

class LoyaltyProgramModel {
  get collection() {
    return databaseService.db.collection<ILoyaltyProgram>('loyaltyprograms') // Note: MongoDB typically keeps collection names lowercase, wait I will use 'loyalty_programs' or 'loyaltyprograms'. Mongoose used 'loyaltyprograms'.
  }
}

const LoyaltyProgram = new LoyaltyProgramModel()
export default LoyaltyProgram
