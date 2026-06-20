import { Request, Response } from 'express'
import { AddToCartBodyType, CartItemParamsType, UpdateCartItemBodyType } from '~/schemaValidations/cart.schema'
import cartService from '~/services/cart.service'

export const getCartController = async (req: Request, res: Response) => {
  const { data, message } = await cartService.getCart(req.decodedAccessToken?.userId as string)
  return res.json({
    message,
    data
  })
}

export const addToCartController = async (req: Request, res: Response) => {
  const { data, message } = await cartService.addToCart(
    req.decodedAccessToken?.userId as string,
    req.body as AddToCartBodyType
  )
  return res.json({
    message,
    data
  })
}

export const updateCartItemController = async (req: Request, res: Response) => {
  const { data, message } = await cartService.updateCartItem(
    req.decodedAccessToken?.userId as string,
    req.params as CartItemParamsType,
    req.body as UpdateCartItemBodyType
  )
  return res.json({
    message,
    data
  })
}

export const removeCartItemController = async (req: Request, res: Response) => {
  const { data, message } = await cartService.removeCartItem(
    req.decodedAccessToken?.userId as string,
    req.params as CartItemParamsType
  )
  return res.json({
    message,
    data
  })
}

export const clearCartController = async (req: Request, res: Response) => {
  const { data, message } = await cartService.clearCart(req.decodedAccessToken?.userId as string)
  return res.json({
    message,
    data
  })
}
