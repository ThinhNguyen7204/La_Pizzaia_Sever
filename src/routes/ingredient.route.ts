import { Router } from 'express'
import { z } from 'zod'
import {
  createIngredientController,
  deleteIngredientController,
  getIngredientDetailController,
  getIngredientListController,
  updateIngredientController
} from '~/controllers/ingredient.controller'
import { requireLogined, requireManager } from '~/middlewares/auth.middleware'
import { validateRequest } from '~/middlewares/validator.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import { CreateIngredientBody, IngredientParams, UpdateIngredientBody } from '~/schemaValidations/ingredient.schema'

const ingredientRoutes = Router()

ingredientRoutes.use(requireLogined)
ingredientRoutes.use(requireManager)

ingredientRoutes.get('/', wrapRequestHandler(getIngredientListController))

ingredientRoutes.get(
  '/:id',
  validateRequest(z.object({ params: IngredientParams })),
  wrapRequestHandler(getIngredientDetailController)
)

ingredientRoutes.post(
  '/',
  validateRequest(z.object({ body: CreateIngredientBody })),
  wrapRequestHandler(createIngredientController)
)

ingredientRoutes.put(
  '/:id',
  validateRequest(z.object({ params: IngredientParams, body: UpdateIngredientBody })),
  wrapRequestHandler(updateIngredientController)
)

ingredientRoutes.delete(
  '/:id',
  validateRequest(z.object({ params: IngredientParams })),
  wrapRequestHandler(deleteIngredientController)
)

export default ingredientRoutes
