import { Router } from 'express'
import {
  getProductListController,
  getProductDetailController,
  createProductController,
  updateProductController,
  deteleProductController
} from '~/controllers/product.controller'
import { requireAdmin, requireLogined } from '~/middlewares/auth.middleware'
import { validateRequest } from '~/middlewares/validator.middleware'
import { CreateProductBody, ProductParams, UpdateProductBody } from '~/schemaValidations/product.schema'
import { wrapRequestHandler } from '~/utils/handlers'
import z from 'zod'

const productRoutes = Router()

productRoutes.get('/', wrapRequestHandler(getProductListController))

productRoutes.get(
  '/:id',
  validateRequest(z.object({ params: ProductParams })),
  wrapRequestHandler(getProductDetailController)
)

productRoutes.post(
  '/',
  requireLogined,
  requireAdmin,
  validateRequest(z.object({ body: CreateProductBody })),
  wrapRequestHandler(createProductController)
)

productRoutes.put(
  '/:id',
  requireLogined,
  requireAdmin,
  validateRequest(z.object({ params: ProductParams, body: UpdateProductBody })),
  wrapRequestHandler(updateProductController)
)

productRoutes.delete(
  '/:id',
  requireLogined,
  requireAdmin,
  validateRequest(z.object({ params: ProductParams })),
  wrapRequestHandler(deteleProductController)
)

export default productRoutes
