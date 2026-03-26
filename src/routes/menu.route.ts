import { Router } from 'express'
import { requireAdmin, requireLogined } from '~/middlewares/auth.middleware'
import { validateRequest } from '~/middlewares/validator.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import z from 'zod'
import {
  createMenuController,
  deteleMenuController,
  getMenuDetailController,
  getMenuListController,
  updateMenuController
} from '~/controllers/menu.controller'
import { CreateMenuBody, MenuParams, UpdateMenuBody } from '~/schemaValidations/menu.schema'

const menuRoutes = Router()

menuRoutes.get('/', wrapRequestHandler(getMenuListController))

menuRoutes.get('/:id', validateRequest(z.object({ params: MenuParams })), wrapRequestHandler(getMenuDetailController))

menuRoutes.post(
  '/',
  requireLogined,
  requireAdmin,
  validateRequest(z.object({ body: CreateMenuBody })),
  wrapRequestHandler(createMenuController)
)

menuRoutes.put(
  '/:id',
  requireLogined,
  requireAdmin,
  validateRequest(z.object({ params: MenuParams, body: UpdateMenuBody })),
  wrapRequestHandler(updateMenuController)
)

menuRoutes.delete(
  '/:id',
  requireLogined,
  requireAdmin,
  validateRequest(z.object({ params: MenuParams })),
  wrapRequestHandler(deteleMenuController)
)

export default menuRoutes
