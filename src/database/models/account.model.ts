import { ObjectId } from 'mongodb'
import databaseService from '~/database'

export interface IAccount {
  _id?: ObjectId
  username: string
  password: string
  email: string
  avatar?: string | null
  role: string
  createdAt?: Date
  updatedAt?: Date
}

class AccountModel {
  get collection() {
    return databaseService.db.collection<IAccount>('accounts')
  }
}

const Account = new AccountModel()
export default Account
