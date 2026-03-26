import { Request, Response } from 'express'
import { LoginBodyType, LogoutBodyType, RefreshTokenBodyType } from '~/schemaValidations/auth.schema'
import authService from '~/services/auth.service'

export const logOutController = async (req: Request, res: Response) => {
  const { message } = await authService.logout(req.body as LogoutBodyType)
  return res.json({
    message
  })
}

export const loginController = async (req: Request, res: Response) => {
  const { accessToken, refreshToken, account } = await authService.login(req.body as LoginBodyType)
  if (!accessToken || !refreshToken || !account) {
    return res.status(400).json({
      message: 'Login failed'
    })
  }
  return res.json({
    message: 'Login successful',
    data: { account, accessToken, refreshToken }
  })
}

export const refreshTokenController = async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await authService.refreshToken(req.body as RefreshTokenBodyType)
  if (!accessToken || !refreshToken) {
    return res.status(400).json({
      message: 'Take refresh-token failed'
    })
  }
  return res.json({
    message: 'Take refresh-token successful',
    data: { accessToken, refreshToken }
  })
}

export const registerController = (req: Request, res: Response) => {
  const { email, password } = req.body
  const result = authService.login({ email, password })
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({
    error: 'Login failed'
  })
}
