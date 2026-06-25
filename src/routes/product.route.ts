import { Router } from 'express'
import {
  getProductListController,
  getProductDetailController,
  createProductController,
  updateProductController,
  deleteProductController
} from '~/controllers/product.controller'
import { requireManager, requireLogined } from '~/middlewares/auth.middleware'
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
  requireManager,
  validateRequest(z.object({ body: CreateProductBody })),
  wrapRequestHandler(createProductController)
)

productRoutes.put(
  '/:id',
  requireLogined,
  requireManager,
  validateRequest(z.object({ params: ProductParams, body: UpdateProductBody })),
  wrapRequestHandler(updateProductController)
)

productRoutes.delete(
  '/:id',
  requireLogined,
  requireManager,
  validateRequest(z.object({ params: ProductParams })),
  wrapRequestHandler(deleteProductController)
)

export default productRoutes
