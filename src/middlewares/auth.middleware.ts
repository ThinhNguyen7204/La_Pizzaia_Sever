import { NextFunction, Request, Response } from 'express'
import { Role } from '~/constants/type'
import { AuthError, ForbiddenError } from '~/utils/errors'
import { verifyAccessToken } from '~/utils/jwt'

export const requireLogined = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1]
    if (!accessToken) throw new AuthError('Access token not found')

    const decodedAccessToken = verifyAccessToken(accessToken)
    req.decodedAccessToken = decodedAccessToken
    next()
  } catch (error) {
    next(new AuthError('Invalid access token'))
  }
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.decodedAccessToken?.role !== Role.Admin) {
    return next(new ForbiddenError('Access denied'))
  }
  next()
}

export const requireManager = (req: Request, res: Response, next: NextFunction) => {
  const role = req.decodedAccessToken?.role
  if (role !== Role.Admin && role !== Role.Manager) {
    return next(new ForbiddenError('Access denied'))
  }
  next()
}

