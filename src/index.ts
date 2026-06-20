import express from 'express'
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

const app = express()
const port = envConfig.PORT || 4000

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
      console.log(`Server is running: ${API_URL}`)
    })
  } catch (err) {
    console.error('Server startup error:', err)
    process.exit(1)
  }
}

start()
