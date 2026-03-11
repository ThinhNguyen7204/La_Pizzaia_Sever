import { ObjectId } from 'mongodb'
import databaseService from '~/database'

export interface IRefreshToken {
  _id?: ObjectId
  token: string
  account_id: ObjectId
  expiresAt: Date
  createdAt?: Date
}

class RefreshTokenModel {
  get collection() {
    return databaseService.db.collection<IRefreshToken>('refreshtokens')
  }
}

const RefreshToken = new RefreshTokenModel()
export default RefreshToken
