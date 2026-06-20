import { Router } from 'express'
import { createOrderController, getDetailOrderController, getListOrderController, updateOrderController } from '~/controllers/order.controller'
import { requireLogined } from '~/middlewares/auth.middleware'
import { validateRequest } from '~/middlewares/validator.middleware'
import { OrderParams, OrderQuery, CreateOrderBody, UpdateOrderBody } from '~/schemaValidations/order.schema'
import { wrapRequestHandler } from '~/utils/handlers'
import z from 'zod'

const orderRoutes = Router()
orderRoutes.use(requireLogined)

orderRoutes.get('/', validateRequest(z.object({ query: OrderQuery })), wrapRequestHandler(getListOrderController))

orderRoutes.get(
  '/:id',
  validateRequest(z.object({ params: OrderParams })),
  wrapRequestHandler(getDetailOrderController)
)

orderRoutes.post('/', validateRequest(z.object({ body: CreateOrderBody })), wrapRequestHandler(createOrderController))

orderRoutes.put(
  '/:id',
  validateRequest(z.object({ params: OrderParams, body: UpdateOrderBody })),
  wrapRequestHandler(updateOrderController)
)

export default orderRoutes
