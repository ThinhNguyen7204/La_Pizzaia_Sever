import productService from '~/services/product.service'
import { Request, Response } from 'express'
import { CreateProductBodyType, UpdateProductBodyType } from '~/schemaValidations/product.schema'

export const getProductListController = async (req: Request, res: Response) => {
  const { data, message } = await productService.getProductList()
  return res.json({
    message,
    data
  })
}

export const getProductDetailController = async (req: Request, res: Response) => {
  const { data, message } = await productService.getDetailProduct(req.params.id as string)
  return res.json({
    message,
    data
  })
}

export const createProductController = async (req: Request, res: Response) => {
  const { data, message } = await productService.createProduct(req.body as CreateProductBodyType)
  return res.json({
    message,
    data
  })
}

export const updateProductController = async (req: Request, res: Response) => {
  const { data, message } = await productService.updateProduct(
    req.params.id as string,
    req.body as UpdateProductBodyType
  )
  return res.json({
    message,
    data
  })
}

export const deteleProductController = async (req: Request, res: Response) => {
  const { data, message } = await productService.deleteProduct(req.params.id as string)
  return res.json({
    message,
    data
  })
}
