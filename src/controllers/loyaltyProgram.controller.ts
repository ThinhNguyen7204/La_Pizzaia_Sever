import { Request, Response } from 'express'
import { CreateLoyaltyProgramBodyType, UpdateLoyaltyProgramBodyType } from '~/schemaValidations/loyaltyProgram.schema'
import loyaltyProgramService from '~/services/loyaltyProgram.service'

export const getLoyaltyProgramListController = async (req: Request, res: Response) => {
  const { data, message } = await loyaltyProgramService.getLoyaltyProgramList()
  return res.json({
    message,
    data
  })
}

export const getLoyaltyProgramDetailController = async (req: Request, res: Response) => {
  const { data, message } = await loyaltyProgramService.getLoyaltyProgramDetail(req.params.id as string)
  return res.json({
    message,
    data
  })
}

export const createLoyaltyProgramController = async (req: Request, res: Response) => {
  const { data, message } = await loyaltyProgramService.createLoyaltyProgram(req.body as CreateLoyaltyProgramBodyType)
  return res.json({
    message,
    data
  })
}

export const updateLoyaltyProgramController = async (req: Request, res: Response) => {
  const { data, message } = await loyaltyProgramService.updateLoyaltyProgram(req.params.id as string, req.body as UpdateLoyaltyProgramBodyType)
  return res.json({
    message,
    data
  })
}

export const deleteLoyaltyProgramController = async (req: Request, res: Response) => {
  const { data, message } = await loyaltyProgramService.deleteLoyaltyProgram(req.params.id as string)
  return res.json({
    message,
    data
  })
}
