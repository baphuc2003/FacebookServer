import { ObjectId } from 'mongodb'
import database from './database.services'

class Conversations {
  async getConversation({
    senderId,
    receiverId,
    limit,
    page
  }: {
    senderId: string
    receiverId: string
    limit: number
    page: number
  }) {
    const match = {
      $or: [
        { sender_id: new ObjectId(senderId), receiver_id: new ObjectId(receiverId) },
        { sender_id: new ObjectId(receiverId), receiver_id: new ObjectId(senderId) }
      ]
    }
    const conversation = await database.conversation
      .find(match)
      .sort({ created_at: -1 })
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray()
    const total = await database.conversation.countDocuments(match)
    return {
      conversation,
      total
    }
  }
}

const conversationService = new Conversations()
export default conversationService
