import { Router } from 'express'
import { z } from 'zod'
import {
  createSupplierController,
  deleteSupplierController,
  getSupplierDetailController,
  getSupplierListController,
  updateSupplierController
} from '~/controllers/supplier.controller'
import { requireLogined, requireManager } from '~/middlewares/auth.middleware'
import { validateRequest } from '~/middlewares/validator.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import { CreateSupplierBody, SupplierParams, UpdateSupplierBody } from '~/schemaValidations/supplier.schema'

const supplierRoutes = Router()

supplierRoutes.use(requireLogined)
supplierRoutes.use(requireManager)

supplierRoutes.get('/', wrapRequestHandler(getSupplierListController))

supplierRoutes.get(
  '/:id',
  validateRequest(z.object({ params: SupplierParams })),
  wrapRequestHandler(getSupplierDetailController)
)

supplierRoutes.post(
  '/',
  validateRequest(z.object({ body: CreateSupplierBody })),
  wrapRequestHandler(createSupplierController)
)

supplierRoutes.put(
  '/:id',
  validateRequest(z.object({ params: SupplierParams, body: UpdateSupplierBody })),
  wrapRequestHandler(updateSupplierController)
)

supplierRoutes.delete(
  '/:id',
  validateRequest(z.object({ params: SupplierParams })),
  wrapRequestHandler(deleteSupplierController)
)

export default supplierRoutes
