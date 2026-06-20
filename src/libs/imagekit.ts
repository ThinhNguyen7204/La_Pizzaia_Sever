import ImageKit from '@imagekit/nodejs'
import envConfig from '~/config'

export const imagekitClient = new ImageKit({
  privateKey: envConfig.IMAGEKIT_PRIVATE_KEY
})
