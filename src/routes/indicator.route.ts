import { Router } from 'express'
import { getDashboardIndicatorsController } from '~/controllers/indicator.controller'
import { requireAdmin, requireLogined } from '~/middlewares/auth.middleware'
import { validateRequest } from '~/middlewares/validator.middleware'
import { DashboardIndicatorQueryParams } from '~/schemaValidations/indicator.schema'
import { wrapRequestHandler } from '~/utils/handlers'
import z from 'zod'

const indicatorRoutes = Router()

indicatorRoutes.get(
  '/dashboard',
  requireLogined,
  requireAdmin,
  validateRequest(z.object({ query: DashboardIndicatorQueryParams })),
  wrapRequestHandler(getDashboardIndicatorsController)
)

export default indicatorRoutes
