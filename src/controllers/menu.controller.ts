import { Request, Response } from 'express'
import { CreateMenuBodyType, UpdateMenuBodyType } from '~/schemaValidations/menu.schema'
import menuService from '~/services/menu.service'

export const getMenuListController = async (req: Request, res: Response) => {
  const { data, message } = await menuService.getMenuList()
  return res.json({
    message,
    data
  })
}

export const getMenuDetailController = async (req: Request, res: Response) => {
  const { data, message } = await menuService.getDetailMenu(req.params.id as string)
  return res.json({
    message,
    data
  })
}

export const createMenuController = async (req: Request, res: Response) => {
  const { data, message } = await menuService.createMenu(req.body as CreateMenuBodyType)
  return res.json({
    message,
    data
  })
}

export const updateMenuController = async (req: Request, res: Response) => {
  const { data, message } = await menuService.updateMenu(req.params.id as string, req.body as UpdateMenuBodyType)
  return res.json({
    message,
    data
  })
}

export const deteleMenuController = async (req: Request, res: Response) => {
  const { data, message } = await menuService.deleteMenu(req.params.id as string)
  return res.json({
    message,
    data
  })
}
