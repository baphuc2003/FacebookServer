import { ObjectId } from 'mongodb'

interface HashTag {
  _id: ObjectId
  name: string
  created_at: Date
}
