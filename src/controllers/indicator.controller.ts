import { Request, Response } from 'express'
import indicatorService from '~/services/indicator.service'

export const getDashboardIndicatorsController = async (req: Request, res: Response) => {
  const fromDate = new Date(req.query.fromDate as string)
  const toDate = new Date(req.query.toDate as string)
  
  const result = await indicatorService.getDashboardIndicators(fromDate, toDate)
  return res.json(result)
}
