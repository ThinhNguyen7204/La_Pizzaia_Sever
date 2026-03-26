import { NextFunction, Request, Response } from 'express'
import { Role } from '~/constants/type'
import { AuthError } from '~/utils/errors'
import { verifyAccessToken } from '~/utils/jwt'

export const requireLogined = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1]
    if (!accessToken) throw new AuthError('Không nhận được access token')

    const decodedAccessToken = verifyAccessToken(accessToken)
    req.decodedAccessToken = decodedAccessToken
    next()
  } catch (error) {
    next(new AuthError('Access token không hợp lệ'))
  }
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const role = req.decodedAccessToken
  if (!role && role !== Role.Admin) {
    return next(new AuthError('Bạn không có quyền truy cập'))
  }
  next()
}
