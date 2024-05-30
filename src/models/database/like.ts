import { ObjectId } from 'mongodb'

interface ILike {
  _id?: ObjectId
  user_id: ObjectId
  post_id: ObjectId
  created_at?: Date
}

export class Like {
  _id?: ObjectId
  user_id: ObjectId
  post_id: ObjectId
  created_at?: Date

  constructor(like: ILike) {
    this._id = like._id || new ObjectId()
    this.user_id = like.user_id
    this.post_id = like.post_id
    this.created_at = like.created_at || new Date()
  }
}
