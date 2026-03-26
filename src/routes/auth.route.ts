import { Router } from 'express'
import {
  loginController,
  registerController,
  refreshTokenController,
  logOutController
} from '~/controllers/auth.controller'
import { validateRequest } from '~/middlewares/validator.middleware'
import { LoginBody, LogoutBody, RefreshTokenBody } from '~/schemaValidations/auth.schema'
import z from 'zod'
import { wrapRequestHandler } from '~/utils/handlers'
import { requireLogined } from '~/middlewares/auth.middleware'

const authRoutes = Router()

authRoutes.post(
  '/logout',
  requireLogined,
  validateRequest(z.object({ body: LogoutBody })),
  wrapRequestHandler(logOutController)
)
authRoutes.post('/login', validateRequest(z.object({ body: LoginBody })), wrapRequestHandler(loginController))
authRoutes.post(
  '/refresh-token',
  validateRequest(z.object({ body: RefreshTokenBody })),
  wrapRequestHandler(refreshTokenController)
)
authRoutes.post('/register', registerController)

export default authRoutes
