import express from 'express'
import databaseService from '~/database'
import 'dotenv/config'
import authRoutes from '~/routes/auth.route'
import { errorHandlerMiddleware } from '~/middlewares/error.middleware'
import envConfig, { API_URL } from '~/config'
import { initAdminAccount } from '~/controllers/account.controller'

const app = express()
const port = envConfig.PORT || 4000

app.use(express.json()) // Parse JSON bodies

// Routes
app.use('/auth', authRoutes)

// Error handler
app.use(errorHandlerMiddleware)

databaseService.connect()
const start = async () => {
  try {
    // Connect to MongoDB
    await databaseService.connect()
    // Initialize admin account
    await initAdminAccount()
    // Start server
    app.listen(envConfig.PORT, '0.0.0.0', () => {
      console.log(`Server đang chạy: ${API_URL}`)
    })
  } catch (err) {
    console.error('Server startup error:', err)
    process.exit(1)
  }
}

start()
