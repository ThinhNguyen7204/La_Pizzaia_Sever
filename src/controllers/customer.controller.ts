import { Request, Response } from 'express'
import { CreateCustomerBodyType, UpdateCustomerBodyType } from '~/schemaValidations/customer.schema'
import customerService from '~/services/customer.service'

export const getCustomerListController = async (req: Request, res: Response) => {
  const { data, message } = await customerService.getCustomerList()
  return res.json({
    message,
    data
  })
}

export const getCustomerDetailController = async (req: Request, res: Response) => {
  const { data, message } = await customerService.getCustomerDetail(req.params.id as string)
  return res.json({
    message,
    data
  })
}

export const createCustomerController = async (req: Request, res: Response) => {
  const { data, message } = await customerService.createCustomer(req.body as CreateCustomerBodyType)
  return res.json({
    message,
    data
  })
}

export const updateCustomerController = async (req: Request, res: Response) => {
  const { data, message } = await customerService.updateCustomer(req.params.id as string, req.body as UpdateCustomerBodyType)
  return res.json({
    message,
    data
  })
}

export const deleteCustomerController = async (req: Request, res: Response) => {
  const { data, message } = await customerService.deleteCustomer(req.params.id as string)
  return res.json({
    message,
    data
  })
}
