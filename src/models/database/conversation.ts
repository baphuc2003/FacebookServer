import { ObjectId } from 'mongodb'

interface IConversation {
  _id?: ObjectId
  sender_id: ObjectId
  receiver_id: ObjectId
  content: Buffer
  created_at?: Date
  updated_at?: Date
}

export class Conversation {
  _id?: ObjectId
  sender_id: ObjectId
  receiver_id: ObjectId
  content: Buffer
  created_at?: Date
  updated_at?: Date

  constructor(conversation: IConversation) {
    const date = new Date()
    this._id = conversation._id || new ObjectId()
    this.sender_id = conversation.sender_id
    this.receiver_id = conversation.receiver_id
    this.content = conversation.content
    this.created_at = conversation.created_at || date
    this.updated_at = conversation.updated_at || date
  }
}
