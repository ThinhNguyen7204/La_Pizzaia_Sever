import { Router } from 'express'
import multer from 'multer'
import { uploadImageController } from '~/controllers/media.controller'
import { requireLogined } from '~/middlewares/auth.middleware'
import { wrapRequestHandler } from '~/utils/handlers'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10 // 10MB
  }
})

const mediaRoutes = Router()

mediaRoutes.use(requireLogined)

mediaRoutes.post('/upload', upload.single('file'), wrapRequestHandler(uploadImageController))

export default mediaRoutes
