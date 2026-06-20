import { Request, Response } from 'express'
import mediaService from '~/services/media.service'

export const uploadImageController = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new Error('File not found')
  }
  const { data, message } = await mediaService.uploadImage(req.file.buffer, req.file.originalname)
  return res.json({
    message,
    data
  })
}
