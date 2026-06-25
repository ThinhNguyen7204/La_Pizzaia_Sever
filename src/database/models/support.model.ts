import { ObjectId } from 'mongodb'
import databaseService from '~/database'

export interface ISupportReply {
  sender: 'Admin' | 'Customer'
  content: string
  timestamp: string
}

export interface ISupport {
  _id?: ObjectId
  name: string
  email: string
  phone?: string
  category: string
  message: string
  status: 'Pending' | 'Processing' | 'Resolved'
  replies?: ISupportReply[]
  createdAt?: Date
  updatedAt?: Date
}

class SupportModel {
  get collection() {
    return databaseService.db.collection<ISupport>('supports')
  }
}

const Support = new SupportModel()
export default Support
