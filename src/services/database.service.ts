import { MongoClient } from 'mongodb'
const databaseName = process.env.DB_USERNAME
const databasePassword = process.env.DB_PASSWORD
const uri = `mongodb+srv://${databaseName}:${databasePassword}@cluster0.ww7jj.mongodb.net/?appName=Cluster0`

class DatabaseService {
  private client: MongoClient
  constructor() {
    this.client = new MongoClient(uri)
  }
  async connect() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await this.client.connect()
      // Send a ping to confirm a successful connection
      await this.client.db('admin').command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } finally {
      // Ensures that the client will close when you finish/error
      await this.client.close()
    }
  }
}

const databaseService = new DatabaseService()
export default databaseService
