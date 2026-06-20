import { Request, Response } from 'express'
import { CreateIngredientBodyType, UpdateIngredientBodyType } from '~/schemaValidations/ingredient.schema'
import ingredientService from '~/services/ingredient.service'

export const getIngredientListController = async (req: Request, res: Response) => {
  const { data, message } = await ingredientService.getIngredientList()
  return res.json({
    message,
    data
  })
}

export const getIngredientDetailController = async (req: Request, res: Response) => {
  const { data, message } = await ingredientService.getIngredientDetail(req.params.id as string)
  return res.json({
    message,
    data
  })
}

export const createIngredientController = async (req: Request, res: Response) => {
  const { data, message } = await ingredientService.createIngredient(req.body as CreateIngredientBodyType)
  return res.json({
    message,
    data
  })
}

export const updateIngredientController = async (req: Request, res: Response) => {
  const { data, message } = await ingredientService.updateIngredient(req.params.id as string, req.body as UpdateIngredientBodyType)
  return res.json({
    message,
    data
  })
}

export const deleteIngredientController = async (req: Request, res: Response) => {
  const { data, message } = await ingredientService.deleteIngredient(req.params.id as string)
  return res.json({
    message,
    data
  })
}
