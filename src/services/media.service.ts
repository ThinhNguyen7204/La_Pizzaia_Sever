import { imagekitClient } from '~/libs/imagekit'
import { toFile } from '@imagekit/nodejs'
import path from 'path'

class MediaService {
  async uploadImage(buffer: Buffer, filename: string) {
    const ext = path.extname(filename) || '.jpg'
    const uniqueName = `pizza-${Date.now()}${ext}`

    const fileForUpload = await toFile(buffer, uniqueName)

    const resp = await imagekitClient.files.upload({
      file: fileForUpload,
      fileName: uniqueName,
      folder: '/pizza-chain'
    })

    return {
      data: (resp as any).url as string,
      message: 'Upload image successfully'
    }
  }
}

const mediaService = new MediaService()
export default mediaService
