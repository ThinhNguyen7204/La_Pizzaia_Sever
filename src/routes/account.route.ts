import { Router } from 'express'
import {
  getAccountListController,
  createEmployeeAccountController,
  getEmployeeAccountController,
  updateEmployeeAccountController,
  deleteEmployeeAccountController,
  getMeController,
  updateMeController,
  changePasswordController
} from '~/controllers/account.controller'
import { requireAdmin, requireLogined } from '~/middlewares/auth.middleware'
import { validateRequest } from '~/middlewares/validator.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import z from 'zod'
import {
  AccountIdParam,
  ChangePasswordBody,
  CreateEmployeeAccountBody,
  UpdateEmployeeAccountBody,
  UpdateMeBody
} from '~/schemaValidations/account.schema'

const accountRoutes = Router()

accountRoutes.get('/', requireLogined, requireAdmin, wrapRequestHandler(getAccountListController))

accountRoutes.post(
  '/',
  requireLogined,
  requireAdmin,
  validateRequest(z.object({ body: CreateEmployeeAccountBody })),
  wrapRequestHandler(createEmployeeAccountController)
)

accountRoutes.get(
  '/detail/:id',
  requireLogined,
  requireAdmin,
  validateRequest(z.object({ params: AccountIdParam })),
  wrapRequestHandler(getEmployeeAccountController)
)

accountRoutes.put(
  '/detail/:id',
  requireLogined,
  requireAdmin,
  validateRequest(z.object({ params: AccountIdParam, body: UpdateEmployeeAccountBody })),
  wrapRequestHandler(updateEmployeeAccountController)
)

accountRoutes.delete(
  '/detail/:id',
  requireLogined,
  requireAdmin,
  validateRequest(z.object({ params: AccountIdParam })),
  wrapRequestHandler(deleteEmployeeAccountController)
)

accountRoutes.get('/me', requireLogined, wrapRequestHandler(getMeController))

accountRoutes.put(
  '/me',
  requireLogined,
  validateRequest(z.object({ body: UpdateMeBody })),
  wrapRequestHandler(updateMeController)
)

accountRoutes.put(
  '/change-password',
  requireLogined,
  validateRequest(z.object({ body: ChangePasswordBody })),
  wrapRequestHandler(changePasswordController)
)

export default accountRoutes
