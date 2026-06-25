import { ObjectId } from 'mongodb'
import Support from '~/database/models/support.model'
import { CreateSupportBodyType, UpdateSupportBodyType } from '~/schemaValidations/support.schema'
import { StatusError } from '~/utils/errors'

class SupportService {
  async getListSupport() {
    const supports = await Support.collection.find().sort({ createdAt: -1 }).toArray()
    const formattedData = supports.map((s) => ({ ...s, id: s._id?.toString(), _id: s._id?.toString() }))
    return {
      data: formattedData,
      message: 'Get support list successfully'
    }
  }

  async getMySupports(email: string) {
    const supports = await Support.collection.find({ email: email.trim().toLowerCase() }).sort({ createdAt: -1 }).toArray()
    const formattedData = supports.map((s) => ({ ...s, id: s._id?.toString(), _id: s._id?.toString() }))
    return {
      data: formattedData,
      message: 'Get my support list successfully'
    }
  }

  async getDetailSupport(id: string) {
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Support ticket does not exist', status: 404 })
    const support = await Support.collection.findOne({ _id: new ObjectId(id) })
    if (!support) throw new StatusError({ message: 'Support ticket does not exist', status: 404 })
    return {
      data: { id: support._id.toString(), ...support },
      message: 'Get support detail successfully'
    }
  }

  async createSupport(body: CreateSupportBodyType) {
    const now = new Date()
    const newSupport = {
      ...body,
      email: body.email.trim().toLowerCase(),
      status: 'Pending' as const,
      replies: [],
      createdAt: now,
      updatedAt: now
    }
    const result = await Support.collection.insertOne(newSupport)
    return {
      data: { id: result.insertedId.toString(), _id: result.insertedId.toString(), ...newSupport },
      message: 'Create support ticket successfully'
    }
  }

  async updateSupport(id: string, body: UpdateSupportBodyType) {
    if (!ObjectId.isValid(id)) throw new StatusError({ message: 'Support ticket does not exist', status: 404 })
    const updated = await Support.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )
    if (!updated) throw new StatusError({ message: 'Support ticket does not exist', status: 404 })
    return {
      data: { id: updated._id.toString(), ...updated },
      message: 'Update support ticket successfully'
    }
  }
}

const supportService = new SupportService()
export default supportService
