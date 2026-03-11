import { AuthError, EntityError, ForbiddenError, StatusError, isDuplicateKeyError } from '~/utils/errors'
import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

const isEntityError = (error: any): error is EntityError => {
  if (error instanceof EntityError) {
    return true
  }
  return false
}

const isAuthError = (error: any): error is AuthError => {
  if (error instanceof AuthError) {
    return true
  }
  return false
}

const isForbiddenError = (error: any): error is ForbiddenError => {
  if (error instanceof ForbiddenError) {
    return true
  }
  return false
}

const isStatusError = (error: any): error is StatusError => {
  if (error instanceof StatusError) {
    return true
  }
  return false
}

export const errorHandlerMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (isEntityError(error)) {
    res.status(error.status).json({
      message: 'Lỗi xảy ra khi xác thực dữ liệu...',
      errors: error.fields,
      statusCode: error.status
    })
    return
  } else if (isForbiddenError(error)) {
    res.status(error.status).json({
      message: error.message,
      statusCode: error.status
    })
    return
  } else if (isAuthError(error)) {
    res
      .cookie('session_token', '', {
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true
      })
      .status(error.status)
      .json({
        message: error.message,
        statusCode: error.status
      })
    return
  } else if (isStatusError(error)) {
    res.status(error.status).json({
      message: error.message,
      statusCode: error.status
    })
    return
  } else if (error instanceof ZodError) {
    const { issues } = error
    const errors = issues.map((issue) => {
      return {
        ...issue,
        field: issue.path.join('.')
      }
    })
    const statusCode = 422
    res.status(statusCode).json({
      message: 'A validation error occurred',
      errors,
      statusCode
    })
    return
  } else if (isDuplicateKeyError(error)) {
    const statusCode = 409
    const keyPattern = (error as any).keyPattern || {}
    const field = Object.keys(keyPattern)[0] || 'unknown'
    res.status(statusCode).json({
      message: `Giá trị ${field} đã tồn tại!`,
      statusCode
    })
    return
  } else if (error.name === 'CastError') {
    res.status(400).json({
      message: 'ID không hợp lệ!',
      statusCode: 400
    })
    return
  } else {
    const statusCode = (error as any).statusCode || 500
    res.status(statusCode).json({
      message: error.message || 'Lỗi server nội bộ',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
      statusCode
    })
    return
  }
}
