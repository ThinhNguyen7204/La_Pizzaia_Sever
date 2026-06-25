import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import http from 'http'
import { initSocket } from '~/libs/socket'
import databaseService from '~/database'
import 'dotenv/config'
import authRoutes from '~/routes/auth.route'
import { errorHandlerMiddleware } from '~/middlewares/error.middleware'
import envConfig, { API_URL } from '~/config'
import { initAdminAccount } from '~/controllers/account.controller'
import accountRoutes from '~/routes/account.route'
import productRoutes from '~/routes/product.route'
import menuRoutes from '~/routes/menu.route'
import orderRoutes from '~/routes/order.route'
import cartRoutes from '~/routes/cart.route'
import customerRoutes from '~/routes/customer.route'
import ingredientRoutes from '~/routes/ingredient.route'
import supplierRoutes from '~/routes/supplier.route'
import voucherRoutes from '~/routes/voucher.route'
import loyaltyProgramRoutes from '~/routes/loyaltyProgram.route'
import mediaRoutes from '~/routes/media.route'
import staticRoutes from '~/routes/static.route'
import indicatorRoutes from '~/routes/indicator.route'
import supportRoutes from '~/routes/support.route'

const app = express()

// Middlewares
app.use(
  cors({
    origin: true,
    credentials: true
  })
)
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    }
  })
)
app.use(cookieParser())

app.use(express.json()) // Parse JSON bodies

// Routes
app.use('/auth', authRoutes)
app.use('/accounts', accountRoutes)
app.use('/products', productRoutes)
app.use('/menus', menuRoutes)
app.use('/orders', orderRoutes)
app.use('/cart', cartRoutes)
app.use('/customers', customerRoutes)
app.use('/ingredients', ingredientRoutes)
app.use('/suppliers', supplierRoutes)
app.use('/vouchers', voucherRoutes)
app.use('/loyalty-programs', loyaltyProgramRoutes)
app.use('/media', mediaRoutes)
app.use('/static', staticRoutes)
app.use('/indicators', indicatorRoutes)
app.use('/supports', supportRoutes)

// Error handler
app.use(errorHandlerMiddleware)

const server = http.createServer(app)
initSocket(server)

databaseService.connect()
const start = async () => {
  try {
    // Connect to MongoDB
    await databaseService.connect()
    // Initialize admin account
    await initAdminAccount()
    // Start server
    server.listen(envConfig.PORT, '0.0.0.0', () => {
    })
  } catch (err) {
    console.error('Server startup error:', err)
    process.exit(1)
  }
}

start()
