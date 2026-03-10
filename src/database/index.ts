import { error } from 'node:console'
import { Db, MongoClient, ServerApiVersion } from 'mongodb'
import 'dotenv/config'

const databaseName = process.env.DB_USERNAME
const databasePassword = process.env.DB_PASSWORD
const uri = `mongodb+srv://${databaseName}:${databasePassword}@cluster0.ww7jj.mongodb.net/?appName=Cluster0`

class DatabaseService {
  private client: MongoClient
  public db!: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }
  async connect() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await this.client.connect()
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

const databaseService = new DatabaseService()
export default databaseService
