import { ObjectId } from 'mongodb'

interface Bookmark {
  _id: ObjectId
  user_id: ObjectId
  tweet_id: ObjectId
  created_at: Date
}
