import { ObjectId, ReturnDocument } from 'mongodb'
import { Role } from '~/constants/type'
import Account from '~/database/models/account.model'
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType
} from '~/schemaValidations/account.schema'
import { comparePassword, hashPassword } from '~/utils/crypto'
import { EntityError, isDuplicateKeyError } from '~/utils/errors'
import { omitPassword } from '~/utils/helpers'

class AccountService {
  async getAccountList() {
    const accounts = await Account.collection
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray()
    return {
      data: accounts,
      message: 'Get account list successfully'
    } as AccountListResType
  }

  async createEmployeeAccount(body: CreateEmployeeAccountBodyType) {
    const existingAccount = await Account.collection.findOne({ email: body.email })
    if (existingAccount) {
      throw new EntityError([{ field: 'email', message: 'Email was exist!' }])
    }
    try {
      const hashedPassword = await hashPassword(body.password)
      const now = new Date()
      const newAccount = {
        username: body.name,
        email: body.email,
        password: hashedPassword,
        role: Role.Sales,
        avatar: body.avatar || null,
        createdAt: now,
        updatedAt: now
      }
      const result = await Account.collection.insertOne(newAccount)
      const rest = omitPassword(newAccount)
      return {
        data: { _id: result.insertedId, ...rest },
        message: 'Account created successfully'
      } as AccountResType
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new EntityError([{ field: 'email', message: 'Email exist' }])
      }
      throw error
    }
  }

  async getEmployeeAccount(accountId: string) {
    if (!ObjectId.isValid(accountId)) throw new EntityError([{ field: 'id', message: 'Account not exist' }])
    const account = await Account.collection.findOne({ _id: new ObjectId(accountId) }, { projection: { password: 0 } })
    if (!account) throw new EntityError([{ field: 'id', message: 'Account not exist' }])
    return {
      data: account,
      message: 'Get account successfully'
    } as AccountResType
  }

  async updateEmployeeAccount(accountId: string, body: UpdateEmployeeAccountBodyType) {
    if (!ObjectId.isValid(accountId)) throw new EntityError([{ field: 'id', message: 'Account not exist' }])
    const account = await Account.collection.findOne({ _id: new ObjectId(accountId) })
    if (!account) throw new EntityError([{ field: 'id', message: 'Account not exist' }])
    const existing = await Account.collection.findOne({
      email: body.email
    })
    if (existing) {
      throw new EntityError([{ field: 'email', message: 'Email exist' }])
    }
    try {
      const password = body.changePassword && body.password ? await hashPassword(body.password) : account.password
      const updatedAccount = {
        username: body.name,
        email: body.email,
        password: password,
        role: body.role,
        avatar: body.avatar || null,
        updatedAt: new Date()
      }
      const result = await Account.collection.findOneAndUpdate(
        { _id: new ObjectId(accountId) },
        { $set: updatedAccount },
        { returnDocument: 'after', projection: { password: 0 } }
      )
      return {
        data: result,
        message: 'Account updated successfully'
      } as AccountResType
    } catch (error) {
      console.log('ERROR:', error)
      if (isDuplicateKeyError(error)) {
        throw new EntityError([{ field: 'email', message: 'Email exist' }])
      }
      throw error
    }
  }

  async deleteEmployeeAccount(accountId: string) {
    if (!ObjectId.isValid(accountId)) throw new EntityError([{ field: 'id', message: 'Account not exist' }])
    const account = await Account.collection.findOne({ _id: new ObjectId(accountId) })
    if (!account) throw new EntityError([{ field: 'id', message: 'Account not exist' }])
    const result = await Account.collection.findOneAndDelete(
      { _id: new ObjectId(accountId) },
      { projection: { password: 0 } }
    )
    return {
      data: result,
      message: 'Account deleted successfully'
    } as AccountResType
  }

  async getMe(accountId: string) {
    if (!ObjectId.isValid(accountId)) throw new EntityError([{ field: 'id', message: 'Account not exist' }])

    const account = await Account.collection.findOne({ _id: new ObjectId(accountId) }, { projection: { password: 0 } })
    if (!account) throw new EntityError([{ field: 'id', message: 'Account not exist' }])
    return {
      data: account,
      message: 'Get account successfully'
    } as AccountResType
  }

  async updateMe(accountId: string, body: UpdateMeBodyType) {
    if (!ObjectId.isValid(accountId)) throw new EntityError([{ field: 'id', message: 'Account not exist' }])

    const accountExisting = await Account.collection.findOne(
      { _id: new ObjectId(accountId) },
      { projection: { password: 0 } }
    )
    if (!accountExisting) throw new EntityError([{ field: 'id', message: 'Account not exist' }])
    const account = await Account.collection.findOneAndUpdate(
      { _id: new ObjectId(accountId) },
      { $set: { username: body.name, avatar: body.avatar, updatedAt: new Date() } },
      { returnDocument: 'after', projection: { password: 0 } }
    )
    return {
      data: account,
      message: 'Account updated successfully'
    } as AccountResType
  }

  async changePassword(accountId: string, body: ChangePasswordBodyType) {
    if (!ObjectId.isValid(accountId)) throw new EntityError([{ field: 'id', message: 'Account not exist' }])
    const accountExisting = await Account.collection.findOne({ _id: new ObjectId(accountId) })
    if (!accountExisting) throw new EntityError([{ field: 'id', message: 'Account not exist' }])
    const isMatch = await comparePassword(body.oldPassword, accountExisting.password)
    if (!isMatch) throw new EntityError([{ field: 'oldPassword', message: 'Old password is incorrect' }])
    const hashedPassword = await hashPassword(body.password)
    const updatedAccount = await Account.collection.findOneAndUpdate(
      { _id: new ObjectId(accountId) },
      { $set: { password: hashedPassword, updatedAt: new Date() } },
      { returnDocument: 'after', projection: { password: 0 } }
    )
    return {
      data: updatedAccount,
      message: 'Password changed successfully'
    } as AccountResType
  }
}

const accountService = new AccountService()
export default accountService
