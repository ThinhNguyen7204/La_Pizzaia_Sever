import { UpdateCartItemBody, UpdateCartItemBodyType } from './../schemaValidations/cart.schema'
import { Router } from 'express'
import z from 'zod'
import {
  addToCartController,
  clearCartController,
  getCartController,
  removeCartItemController,
  updateCartItemController
} from '~/controllers/cart.controller'
import { requireLogined } from '~/middlewares/auth.middleware'
import { validateRequest } from '~/middlewares/validator.middleware'
import { AddToCartBody, CartItemParams } from '~/schemaValidations/cart.schema'
import { wrapRequestHandler } from '~/utils/handlers'

const cartRoutes = Router()

cartRoutes.use(requireLogined)

cartRoutes.get('/', wrapRequestHandler(getCartController))

cartRoutes.post('/items', validateRequest(z.object({ body: AddToCartBody })), wrapRequestHandler(addToCartController))

cartRoutes.post(
  '/items:itemId',
  validateRequest(z.object({ params: CartItemParams, body: UpdateCartItemBody })),
  wrapRequestHandler(updateCartItemController)
)

cartRoutes.delete(
  '/items/:itemId',
  validateRequest(z.object({ params: CartItemParams })),
  wrapRequestHandler(removeCartItemController)
)

cartRoutes.delete('/', wrapRequestHandler(clearCartController))

export default cartRoutes
