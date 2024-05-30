import { ObjectId } from 'mongodb'

interface IBookmark {
  _id?: ObjectId
  user_id?: ObjectId
  post_id: ObjectId
  created_at?: Date
}

export class Bookmark {
  _id?: ObjectId
  user_id?: ObjectId
  post_id: ObjectId
  created_at?: Date

  constructor(bookMark: IBookmark) {
    this._id = bookMark._id || new ObjectId()
    this.user_id = bookMark.user_id
    this.post_id = bookMark.post_id
    this.created_at = bookMark.created_at || new Date()
  }
}
