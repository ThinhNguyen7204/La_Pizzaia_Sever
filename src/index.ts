import express from 'express'
import databaseService from '~/database'
import 'dotenv/config'
import authRoutes from '~/routes/auth.route'

const app = express()
const port = process.env.PORT || 4000

app.use(express.json()) // Parse JSON bodies
app.use('/auth', authRoutes)

databaseService.connect()
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
