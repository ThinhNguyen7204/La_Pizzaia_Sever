import Account from '~/database/models/account.model'
import { LoginBodyType, LogoutBodyType, RefreshTokenBodyType } from '~/schemaValidations/auth.schema'
import { RoleType, TokenPayload } from '~/types/jwt.types'
import { comparePassword } from '~/utils/crypto'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '~/utils/jwt'
import { addMilliseconds } from 'date-fns'
import ms, { type StringValue } from 'ms'
import envConfig from '~/config'
import RefreshToken from '~/database/models/refreshToken.model'
import { verify } from 'node:crypto'
import { AuthError } from '~/utils/errors'

class AuthService {
  async logout(body: LogoutBodyType) {
    await RefreshToken.collection.deleteOne({ token: body.refreshToken })
    return {
      message: 'Logout successful'
    }
  }

  async login(body: LoginBodyType) {
    const { email, password } = body
    const account = await Account.collection.findOne({
      email
    })
    if (!account) {
      throw new Error('Account not found')
    }
    const isPasswordMatch = await comparePassword(password, account.password)
    if (!isPasswordMatch) {
      throw new Error('Email hoặc mật khẩu không đúng')
    }
    const accessToken = signAccessToken({
      userId: account._id.toString(),
      role: account.role as RoleType
    })
    const refreshToken = signRefreshToken({
      userId: account._id!.toString(),
      role: account.role as RoleType
    })
    const refreshTokenExpiresAt = addMilliseconds(new Date(), ms(envConfig.REFRESH_TOKEN_EXPIRES_IN as StringValue))
    await RefreshToken.collection.insertOne({
      account_id: account._id!,
      token: refreshToken,
      expiresAt: refreshTokenExpiresAt,
      createdAt: new Date()
    })
    return {
      account: {
        _id: account._id!.toString(),
        username: account.username,
        email: account.email,
        role: account.role
      },
      accessToken,
      refreshToken
    }
  }

  async refreshToken(body: RefreshTokenBodyType) {
    const { refreshToken } = body
    let decodedRefreshToken: TokenPayload
    try {
      decodedRefreshToken = verifyRefreshToken(refreshToken)
    } catch (error) {
      throw new Error('Invalid refresh token')
    }
    const refreshTokenDoc = await RefreshToken.collection.findOne({ token: refreshToken })
    if (!refreshTokenDoc) {
      throw new AuthError('Not exist Refresh token')
    }
    const account = await Account.collection.findOne({ _id: refreshTokenDoc.account_id })
    if (!account) {
      throw new AuthError('Account not found')
    }
    const newAccessToken = signAccessToken({
      userId: account._id!.toString(),
      role: account.role as RoleType
    })
    const newRefreshToken = signRefreshToken(
      {
        userId: account._id!.toString(),
        role: account.role as RoleType
      },
      {
        expiresIn: decodedRefreshToken.exp
      }
    )
    await RefreshToken.collection.deleteOne({ token: refreshToken })
    await RefreshToken.collection.insertOne({
      account_id: account._id!,
      token: newRefreshToken,
      expiresAt: refreshTokenDoc.expiresAt,
      createdAt: new Date()
    })
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }
}

const authService = new AuthService()
export default authService
