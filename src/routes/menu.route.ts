import { Router } from 'express'
import { requireManager, requireLogined } from '~/middlewares/auth.middleware'
import { validateRequest } from '~/middlewares/validator.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import z from 'zod'
import {
  createMenuController,
  deleteMenuController,
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
  requireManager,
  validateRequest(z.object({ body: CreateMenuBody })),
  wrapRequestHandler(createMenuController)
)

menuRoutes.put(
  '/:id',
  requireLogined,
  requireManager,
  validateRequest(z.object({ params: MenuParams, body: UpdateMenuBody })),
  wrapRequestHandler(updateMenuController)
)

menuRoutes.delete(
  '/:id',
  requireLogined,
  requireManager,
  validateRequest(z.object({ params: MenuParams })),
  wrapRequestHandler(deleteMenuController)
)

export default menuRoutes
