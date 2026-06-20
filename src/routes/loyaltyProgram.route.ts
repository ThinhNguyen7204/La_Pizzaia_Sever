import { Router } from 'express'
import { z } from 'zod'
import {
  createLoyaltyProgramController,
  deleteLoyaltyProgramController,
  getLoyaltyProgramDetailController,
  getLoyaltyProgramListController,
  updateLoyaltyProgramController
} from '~/controllers/loyaltyProgram.controller'
import { requireAdmin, requireLogined } from '~/middlewares/auth.middleware'
import { validateRequest } from '~/middlewares/validator.middleware'
import { wrapRequestHandler } from '~/utils/handlers'
import { CreateLoyaltyProgramBody, LoyaltyProgramParams, UpdateLoyaltyProgramBody } from '~/schemaValidations/loyaltyProgram.schema'

const loyaltyProgramRoutes = Router()

loyaltyProgramRoutes.get('/', wrapRequestHandler(getLoyaltyProgramListController))

loyaltyProgramRoutes.get(
  '/:id',
  validateRequest(z.object({ params: LoyaltyProgramParams })),
  wrapRequestHandler(getLoyaltyProgramDetailController)
)

loyaltyProgramRoutes.post(
  '/',
  requireLogined,
  requireAdmin,
  validateRequest(z.object({ body: CreateLoyaltyProgramBody })),
  wrapRequestHandler(createLoyaltyProgramController)
)

loyaltyProgramRoutes.put(
  '/:id',
  requireLogined,
  requireAdmin,
  validateRequest(z.object({ params: LoyaltyProgramParams, body: UpdateLoyaltyProgramBody })),
  wrapRequestHandler(updateLoyaltyProgramController)
)

loyaltyProgramRoutes.delete(
  '/:id',
  requireLogined,
  requireAdmin,
  validateRequest(z.object({ params: LoyaltyProgramParams })),
  wrapRequestHandler(deleteLoyaltyProgramController)
)

export default loyaltyProgramRoutes
