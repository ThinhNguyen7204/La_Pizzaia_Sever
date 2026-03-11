import envConfig from '~/config'
import { Role } from '~/constants/type'
import Account from '~/database/models/account.model'
import { hashPassword } from '~/utils/crypto'
import { getChalk } from '~/utils/helpers'

export const initAdminAccount = async () => {
  const accountCount = await Account.collection.countDocuments()
  if (accountCount === 0) {
    const hashedPassword = await hashPassword(envConfig.INITIAL_PASSWORD_OWNER)
    const now = new Date()
    await Account.collection.insertOne({
      username: 'Admin',
      email: envConfig.INITIAL_EMAIL_OWNER,
      password: hashedPassword,
      role: Role.Admin,
      avatar: null,
      createdAt: now,
      updatedAt: now
    })
    const chalk = await getChalk()
    console.log(
      chalk.bgCyan(
        `Khởi tạo tài khoản admin thành công: ${envConfig.INITIAL_EMAIL_OWNER}|${envConfig.INITIAL_PASSWORD_OWNER}`
      )
    )
  }
}
