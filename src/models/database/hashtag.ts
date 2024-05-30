import { ObjectId } from 'mongodb'

export interface IHashTag {
  _id?: ObjectId
  name: string
  created_at?: Date
}

export class HashTag {
  _id?: ObjectId
  name: string
  created_at?: Date

  constructor(hashTag: IHashTag) {
    this._id = hashTag._id || new ObjectId()
    this.name = hashTag.name
    this.created_at = hashTag.created_at || new Date()
  }
}
