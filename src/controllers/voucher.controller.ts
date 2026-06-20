import { Request, Response } from 'express'
import { CreateVoucherBodyType, UpdateVoucherBodyType, ValidateVoucherBodyType } from '~/schemaValidations/voucher.schema'
import voucherService from '~/services/voucher.service'

export const getVoucherListController = async (req: Request, res: Response) => {
  const { data, message } = await voucherService.getVoucherList()
  return res.json({
    message,
    data
  })
}

export const getVoucherDetailController = async (req: Request, res: Response) => {
  const { data, message } = await voucherService.getVoucherDetail(req.params.id as string)
  return res.json({
    message,
    data
  })
}

export const createVoucherController = async (req: Request, res: Response) => {
  const { data, message } = await voucherService.createVoucher(req.body as CreateVoucherBodyType)
  return res.json({
    message,
    data
  })
}

export const updateVoucherController = async (req: Request, res: Response) => {
  const { data, message } = await voucherService.updateVoucher(req.params.id as string, req.body as UpdateVoucherBodyType)
  return res.json({
    message,
    data
  })
}

export const deleteVoucherController = async (req: Request, res: Response) => {
  const { data, message } = await voucherService.deleteVoucher(req.params.id as string)
  return res.json({
    message,
    data
  })
}

export const validateVoucherController = async (req: Request, res: Response) => {
  const { data, message } = await voucherService.validateVoucher(req.body as ValidateVoucherBodyType)
  return res.json({
    message,
    data
  })
}
