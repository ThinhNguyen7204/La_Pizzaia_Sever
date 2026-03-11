import { Role, TokenType } from '~/constants/type'

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType]
export type RoleType = (typeof Role)[keyof typeof Role]
export interface TokenPayload {
  userId: string
  role: RoleType
  tokenType: TokenTypeValue
  exp: number
  iat: number
}
