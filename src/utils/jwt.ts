import { createSigner, createVerifier, SignerOptions } from 'fast-jwt'
import ms, { type StringValue } from 'ms'
import envConfig from '~/config'
import { TokenType } from '~/constants/type'
import { TokenPayload } from '~/types/jwt.types'

export const signAccessToken = (
  payload: Pick<TokenPayload, 'userId' | 'role'> & {
    exp?: number
  },
  options?: SignerOptions
) => {
  const { exp, ...restPayload } = payload
  const signSync = createSigner({
    key: envConfig.ACCESS_TOKEN_SECRET,
    algorithm: 'HS256',
    expiresIn: payload.exp ?? ms(envConfig.ACCESS_TOKEN_EXPIRES_IN as StringValue),
    ...options
  })

  return signSync({ ...restPayload, tokenType: TokenType.AccessToken })
}

export const signRefreshToken = (
  payload: Pick<TokenPayload, 'userId' | 'role'> & {
    exp?: number
  },
  options?: SignerOptions
) => {
  const { exp, ...restPayload } = payload
  const signSync = createSigner({
    key: envConfig.REFRESH_TOKEN_SECRET,
    algorithm: 'HS256',
    expiresIn: payload.exp ?? ms(envConfig.REFRESH_TOKEN_EXPIRES_IN as StringValue),
    ...options
  })
  return signSync({ ...restPayload, tokenType: TokenType.RefreshToken })
}

export const veryfyAccessToken = (token: string) => {
  const verifySync = createVerifier({
    key: envConfig.ACCESS_TOKEN_SECRET
  })
  return verifySync(token) as TokenPayload
}

export const veryfyRefreshToken = (token: string) => {
  const verifySync = createVerifier({
    key: envConfig.REFRESH_TOKEN_SECRET
  })
  return verifySync(token) as TokenPayload
}
