import { Router } from 'express'
import { loginController, registerController, refreshTokenController } from '~/controllers/auth.controller'
import { validateRequest } from '~/middlewares/validator.middleware'
import { LoginBody, RefreshTokenBody } from '~/schemaValidations/auth.schema'
import z from 'zod'
import { wrapRequestHandler } from '~/utils/handlers'

const authRoutes = Router()

authRoutes.post('/login', validateRequest(z.object({ body: LoginBody })), wrapRequestHandler(loginController))
authRoutes.post(
  '/refresh-token',
  validateRequest(z.object({ body: RefreshTokenBody })),
  wrapRequestHandler(refreshTokenController)
)
authRoutes.post('/register', registerController)

export default authRoutes
