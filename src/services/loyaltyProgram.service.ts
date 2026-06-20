import { ObjectId } from 'mongodb'
import LoyaltyProgram from '~/database/models/loyaltyProgram.model'
import {
  CreateLoyaltyProgramBodyType,
  LoyaltyProgramListResType,
  LoyaltyProgramResType,
  UpdateLoyaltyProgramBodyType
} from '~/schemaValidations/loyaltyProgram.schema'
import { StatusError } from '~/utils/errors'

class LoyaltyProgramService {
  async getLoyaltyProgramList() {
    const list = await LoyaltyProgram.collection.find().sort({ createdAt: -1 }).toArray()
    const formatted = list.map((lp) => ({ ...lp, _id: lp._id.toString() }))
    return {
      data: formatted,
      message: 'Get loyalty program list successfully!'
    } as LoyaltyProgramListResType
  }

  async getLoyaltyProgramDetail(id: string) {
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Loyalty program not found', status: 404 })
    const program = await LoyaltyProgram.collection.findOne({ _id: new ObjectId(id) })
    if (!program) throw new StatusError({ message: 'Loyalty program not found', status: 404 })
    return {
      data: { ...program, _id: program._id.toString() },
      message: 'Get loyalty program detail successfully!'
    } as LoyaltyProgramResType
  }

  async createLoyaltyProgram(data: CreateLoyaltyProgramBodyType) {
    const now = new Date()
    const newProgram = {
      ...data,
      description: data.description || null,
      is_active: data.is_active !== undefined ? data.is_active : true,
      createdAt: now,
      updatedAt: now
    }
    const result = await LoyaltyProgram.collection.insertOne(newProgram)
    return {
      data: { ...newProgram, _id: result.insertedId.toString() },
      message: 'Create loyalty program successfully!'
    } as LoyaltyProgramResType
  }

  async updateLoyaltyProgram(id: string, data: UpdateLoyaltyProgramBodyType) {
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Loyalty program not found', status: 404 })
    const program = await LoyaltyProgram.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )
    if (!program) throw new StatusError({ message: 'Loyalty program not found', status: 404 })
    return {
      data: { ...program, _id: program._id.toString() },
      message: 'Update loyalty program successfully!'
    } as LoyaltyProgramResType
  }

  async deleteLoyaltyProgram(id: string) {
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Loyalty program not found', status: 404 })
    const program = await LoyaltyProgram.collection.findOneAndDelete({ _id: new ObjectId(id) })
    if (!program) throw new StatusError({ message: 'Loyalty program not found', status: 404 })
    return {
      data: { ...program, _id: program._id.toString() },
      message: 'Delete loyalty program successfully!'
    } as LoyaltyProgramResType
  }
}

const loyaltyProgramService = new LoyaltyProgramService()
export default loyaltyProgramService
