import { Collection, Db, MongoClient } from 'mongodb'
import { IUser, User } from '../models/database/user'
import 'dotenv/config'
import RefreshToken from '~/models/database/refreshToken'
import PublicKey from '~/models/database/publicKey'
export class Database {
  private static instance: Database
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(process.env.URI_DATABASE as string)
    this.db = this.client.db(process.env.NAME_DB as string)
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Connected to MongoDb successfully!')
    } catch (error) {
      console.log('Connect to DB failed!!')
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.USER_COLLECTION as string)
  }

  get refreshToken(): Collection<RefreshToken> {
    return this.db.collection(process.env.REFRESH_TOKEN as string)
  }

  get publicKey(): Collection<PublicKey> {
    return this.db.collection(process.env.PUBLIC_KEY as string)
  }
}

const database = Database.getInstance()
export default database
