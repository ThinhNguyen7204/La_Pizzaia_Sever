import { Request, Response } from 'express'
import { CreateSupplierBodyType, UpdateSupplierBodyType } from '~/schemaValidations/supplier.schema'
import supplierService from '~/services/supplier.service'

export const getSupplierListController = async (req: Request, res: Response) => {
  const { data, message } = await supplierService.getSupplierList()
  return res.json({
    message,
    data
  })
}

export const getSupplierDetailController = async (req: Request, res: Response) => {
  const { data, message } = await supplierService.getSupplierDetail(req.params.id as string)
  return res.json({
    message,
    data
  })
}

export const createSupplierController = async (req: Request, res: Response) => {
  const { data, message } = await supplierService.createSupplier(req.body as CreateSupplierBodyType)
  return res.json({
    message,
    data
  })
}

export const updateSupplierController = async (req: Request, res: Response) => {
  const { data, message } = await supplierService.updateSupplier(req.params.id as string, req.body as UpdateSupplierBodyType)
  return res.json({
    message,
    data
  })
}

export const deleteSupplierController = async (req: Request, res: Response) => {
  const { data, message } = await supplierService.deleteSupplier(req.params.id as string)
  return res.json({
    message,
    data
  })
}
