import { Request, Response } from 'express'
import { LoginBodyType, RefreshTokenBodyType } from '~/schemaValidations/auth.schema'
import authService from '~/services/auth.service'

export const loginController = async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken, account } = await authService.login(req.body as LoginBodyType)
    res.json({
      message: 'Login successful',
      data: { account, accessToken, refreshToken }
    })
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken } = await authService.refreshToken(req.body as RefreshTokenBodyType)
    res.json({
      message: 'Take refreshToken successful',
      data: { accessToken, refreshToken }
    })
  } catch (error) {
    console.error('RefreshToken error:', error)
    throw error
  }
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
