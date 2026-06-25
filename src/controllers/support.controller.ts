import { Request, Response } from 'express'
import { CreateSupportBodyType, UpdateSupportBodyType } from '~/schemaValidations/support.schema'
import supportService from '~/services/support.service'

export const getListSupportController = async (req: Request, res: Response) => {
  const { data, message } = await supportService.getListSupport()
  return res.json({
    message,
    data
  })
}

export const getMySupportsController = async (req: Request, res: Response) => {
  const email = req.query.email as string
  const { data, message } = await supportService.getMySupports(email || '')
  return res.json({
    message,
    data
  })
}

export const getDetailSupportController = async (req: Request, res: Response) => {
  const { data, message } = await supportService.getDetailSupport(req.params.id as string)
  return res.json({
    message,
    data
  })
}

export const createSupportController = async (req: Request, res: Response) => {
  const { data, message } = await supportService.createSupport(req.body as CreateSupportBodyType)
  return res.json({
    message,
    data
  })
}

export const updateSupportController = async (req: Request, res: Response) => {
  const { data, message } = await supportService.updateSupport(req.params.id as string, req.body as UpdateSupportBodyType)
  return res.json({
    message,
    data
  })
}
