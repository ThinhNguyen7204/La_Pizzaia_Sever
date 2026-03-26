import envConfig from '~/config'
import { Role } from '~/constants/type'
import Account from '~/database/models/account.model'
import accountService from '~/services/account.service'
import { hashPassword } from '~/utils/crypto'
import { getChalk } from '~/utils/helpers'
import { Request, Response } from 'express'
import {
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType
} from '~/schemaValidations/account.schema'

export const initAdminAccount = async () => {
  const accountCount = await Account.collection.countDocuments()
  if (accountCount === 0) {
    const hashedPassword = await hashPassword(envConfig.INITIAL_PASSWORD_OWNER)
    const now = new Date()
    await Account.collection.insertOne({
      username: 'Admin',
      email: envConfig.INITIAL_EMAIL_OWNER,
      password: hashedPassword,
      role: Role.Admin,
      avatar: null,
      createdAt: now,
      updatedAt: now
    })
    const chalk = await getChalk()
    console.log(
      chalk.bgCyan(
        `Khởi tạo tài khoản admin thành công: ${envConfig.INITIAL_EMAIL_OWNER}|${envConfig.INITIAL_PASSWORD_OWNER}`
      )
    )
  }
}

export const getAccountListController = async (req: Request, res: Response) => {
  const { data, message } = await accountService.getAccountList()
  return res.json({
    message,
    data
  })
}

export const createEmployeeAccountController = async (req: Request, res: Response) => {
  const { data, message } = await accountService.createEmployeeAccount(req.body as CreateEmployeeAccountBodyType)
  return res.json({
    message,
    data
  })
}

export const getEmployeeAccountController = async (req: Request, res: Response) => {
  const { data, message } = await accountService.getEmployeeAccount(req.params.id as string)
  return res.json({
    message,
    data
  })
}

export const updateEmployeeAccountController = async (req: Request, res: Response) => {
  const { data, message } = await accountService.updateEmployeeAccount(
    req.params.id as string,
    req.body as UpdateEmployeeAccountBodyType
  )
  return res.json({
    message,
    data
  })
}

export const deleteEmployeeAccountController = async (req: Request, res: Response) => {
  console.log('deleteEmployeeAccountController called with accountId:', req.params.id)
  const { data, message } = await accountService.deleteEmployeeAccount(req.params.id as string)
  return res.json({
    message,
    data
  })
}

export const getMeController = async (req: Request, res: Response) => {
  const { data, message } = await accountService.getMe(req.decodedAccessToken?.userId as string)
  return res.json({
    message,
    data
  })
}

export const updateMeController = async (req: Request, res: Response) => {
  const { data, message } = await accountService.updateMe(
    req.decodedAccessToken?.userId as string,
    req.body as UpdateMeBodyType
  )
  return res.json({
    message,
    data
  })
}

export const changePasswordController = async (req: Request, res: Response) => {
  const { data, message } = await accountService.changePassword(
    req.decodedAccessToken?.userId as string,
    req.body as ChangePasswordBodyType
  )
  return res.json({
    message,
    data
  })
}
