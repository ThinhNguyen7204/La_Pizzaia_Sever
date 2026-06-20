import { Router } from 'express'
import { z } from 'zod'
import {
  createVoucherController,
  deleteVoucherController,
  getVoucherDetailController,
  getVoucherListController,
  updateVoucherController,
  validateVoucherController
} from '~/controllers/voucher.controller'
import { requireAdmin, requireLogined } from '~/middlewares/auth.middleware'
import { validateRequest } from '~/middlewares/validator.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import { CreateVoucherBody, UpdateVoucherBody, ValidateVoucherBody, VoucherParams } from '~/schemaValidations/voucher.schema'

const voucherRoutes = Router()

voucherRoutes.get('/', wrapRequestHandler(getVoucherListController))

voucherRoutes.get(
  '/:id',
  validateRequest(z.object({ params: VoucherParams })),
  wrapRequestHandler(getVoucherDetailController)
)

voucherRoutes.post(
  '/validate',
  validateRequest(z.object({ body: ValidateVoucherBody })),
  wrapRequestHandler(validateVoucherController)
)

voucherRoutes.post(
  '/',
  requireLogined,
  requireAdmin,
  validateRequest(z.object({ body: CreateVoucherBody })),
  wrapRequestHandler(createVoucherController)
)

voucherRoutes.put(
  '/:id',
  requireLogined,
  requireAdmin,
  validateRequest(z.object({ params: VoucherParams, body: UpdateVoucherBody })),
  wrapRequestHandler(updateVoucherController)
)

voucherRoutes.delete(
  '/:id',
  requireLogined,
  requireAdmin,
  validateRequest(z.object({ params: VoucherParams })),
  wrapRequestHandler(deleteVoucherController)
)

export default voucherRoutes
