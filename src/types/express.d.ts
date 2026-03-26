import { TokenPayload } from './jwt.types'

declare global {
  namespace Express {
    interface Request {
      decodedAccessToken?: TokenPayload
    }
  }
}
