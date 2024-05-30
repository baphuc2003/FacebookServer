import e, { Request, Response, NextFunction } from 'express'
import conversationService from '~/services/conversation.services'

export const getConversationController = async (req: Request, res: Response) => {
  const senderId = req.decoded_access_token?.user_id as string
  const receiverId = req.params.receiverId
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const result = await conversationService.getConversation({
    senderId: senderId,
    receiverId: receiverId,
    limit: limit,
    page: page
  })
  return res.status(200).json({
    message: 'Get conversation successfully!',
    result: {
      limit,
      page,
      total_page: Math.ceil(result.total / limit),
      conversation: result.conversation
    }
  })
}
