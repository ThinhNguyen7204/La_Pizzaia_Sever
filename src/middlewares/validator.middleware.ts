import { NextFunction, Request, Response } from 'express'
import { ZodError, ZodObject } from 'zod'

export const validateRequest = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      })
      req.body = validatedData.body
      Object.assign(req.query, validatedData.query)
      Object.assign(req.params, validatedData.params)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        next(error)
      } else {
        next(error)
      }
    }
  }
}
