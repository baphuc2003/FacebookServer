import { ObjectId } from 'mongodb'

export interface IRefreshToken {
  _id?: ObjectId
  user_id: ObjectId
  token: string
  created_at?: Date
  updated_at?: Date
}

export default class RefreshToken {
  _id?: ObjectId
  user_id: ObjectId
  token: string
  created_at?: Date
  updated_at?: Date

  constructor(token: IRefreshToken) {
    const date = new Date()
    this._id = token._id || new ObjectId()
    this.user_id = token.user_id
    this.token = token.token
    this.created_at = token.created_at || date
    this.updated_at = token.updated_at || date
  }
}
