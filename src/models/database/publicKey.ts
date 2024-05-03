import { ObjectId } from 'mongodb'

export interface IPublicKey {
  _id?: ObjectId
  user_id: ObjectId
  token: string
  created_at?: Date
  updated_at?: Date
}

export default class PublicKey {
  _id?: ObjectId
  user_id: ObjectId
  token: string
  created_at?: Date
  updated_at?: Date

  constructor(token: IPublicKey) {
    const date = new Date()
    this._id = token._id || new ObjectId()
    this.user_id = token.user_id
    this.token = token.token
    this.created_at = token.created_at || date
    this.updated_at = token.updated_at || date
  }
}
