import { Router } from 'express'
import { z } from 'zod'
import {
  createCustomerController,
  deleteCustomerController,
  getCustomerDetailController,
  getCustomerListController,
  updateCustomerController
} from '~/controllers/customer.controller'
import { requireManager, requireLogined } from '~/middlewares/auth.middleware'
import { validateRequest } from '~/middlewares/validator.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import { CreateCustomerBody, CustomerParams, UpdateCustomerBody } from '~/schemaValidations/customer.schema'

const customerRoutes = Router()

customerRoutes.use(requireLogined)

customerRoutes.get('/', requireManager, wrapRequestHandler(getCustomerListController))

customerRoutes.get(
  '/:id',
  requireManager,
  validateRequest(z.object({ params: CustomerParams })),
  wrapRequestHandler(getCustomerDetailController)
)

customerRoutes.post(
  '/',
  requireManager,
  validateRequest(z.object({ body: CreateCustomerBody })),
  wrapRequestHandler(createCustomerController)
)

customerRoutes.put(
  '/:id',
  requireManager,
  validateRequest(z.object({ params: CustomerParams, body: UpdateCustomerBody })),
  wrapRequestHandler(updateCustomerController)
)

customerRoutes.delete(
  '/:id',
  requireManager,
  validateRequest(z.object({ params: CustomerParams })),
  wrapRequestHandler(deleteCustomerController)
)

export default customerRoutes
