import { Collection, Db, MongoClient } from 'mongodb'
import { IUser, User } from '../models/database/user'
import 'dotenv/config'
import RefreshToken from '~/models/database/refreshToken'
import PublicKey from '~/models/database/publicKey'
import { Follow } from '~/models/database/follow'
import { Post } from '~/models/database/post'
import { HashTag } from '~/models/database/hashtag'
import { Bookmark } from '~/models/database/bookmark'
import { Like } from '~/models/database/like'
import { Conversation } from '~/models/database/conversation'
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
      console.log('Connect to DB failed!!', error)
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

  get follow(): Collection<Follow> {
    return this.db.collection(process.env.FOLLOW as string)
  }

  get post(): Collection<Post> {
    return this.db.collection(process.env.POST as string)
  }

  get hashTags(): Collection<HashTag> {
    return this.db.collection(process.env.HASHTAG as string)
  }

  get bookMark(): Collection<Bookmark> {
    return this.db.collection(process.env.BOOKMARK as string)
  }

  get like(): Collection<Like> {
    return this.db.collection(process.env.LIKE as string)
  }

  get conversation(): Collection<Conversation> {
    return this.db.collection(process.env.CONVERSATION as string)
  }
}

const database = Database.getInstance()
export default database
