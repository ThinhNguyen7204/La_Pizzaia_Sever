import productService from '~/services/product.service'
import { Request, Response } from 'express'
import { CreateProductBodyType, ProductParamsType, UpdateProductBodyType } from '~/schemaValidations/product.schema'

export const getProductListController = async (req: Request, res: Response) => {
  const { data, message } = await productService.getProductList()
  return res.json({
    message,
    data
  })
}

export const getProductDetailController = async (req: Request, res: Response) => {
  const { data, message } = await productService.getDetailProduct(req.params as ProductParamsType)
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
    req.params as ProductParamsType,
    req.body as UpdateProductBodyType
  )
  return res.json({
    message,
    data
  })
}

export const deleteProductController = async (req: Request, res: Response) => {
  const { data, message } = await productService.deleteProduct(req.params as ProductParamsType)
  return res.json({
    message,
    data
  })
}
