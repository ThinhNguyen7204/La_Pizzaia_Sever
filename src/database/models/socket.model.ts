import { ObjectId } from 'mongodb'
import databaseService from '~/database'

export interface ISocket {
  _id?: ObjectId
  socketId: string
  guestId?: ObjectId | null
  accountId?: ObjectId | null
  createdAt?: Date
  updatedAt?: Date
}

class SocketModel {
  get collection() {
    return databaseService.db.collection<ISocket>('sockets')
  }
}

const Socket = new SocketModel()
export default Socket
