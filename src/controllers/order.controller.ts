import orderService from '~/services/order.service'
import { Request, Response } from 'express'
import { CreateOrderBodyType, OrderParamsType, OrderQueryType } from '~/schemaValidations/order.schema'

export const getListOrderController = async (req: Request, res: Response) => {
  const { data, message } = await orderService.getListOrder(req.query as OrderQueryType)
  return res.json({
    message,
    data
  })
}

export const getDetailOrderController = async (req: Request, res: Response) => {
  const { data, message } = await orderService.getDetailOrder(req.params as OrderParamsType)
  return res.json({
    message,
    data
  })
}

export const createOrderController = async (req: Request, res: Response) => {
  const { data, message } = await orderService.addOrder(req.body as CreateOrderBodyType)
  return res.json({
    message,
    data
  })
}
