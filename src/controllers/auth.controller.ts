import { json, Request, Response } from 'express'
import authService from '~/services/auth.service'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  const result = authService.login({ email, password })
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({
    error: 'Login failed'
  })
}
