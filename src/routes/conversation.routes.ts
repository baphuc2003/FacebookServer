import { Router } from 'express'
import { getConversationController } from '~/controllers/conversation.controllers'
import { conversationIdValidator, limitAndPageValidator } from '~/middlewares/conversation.middleware'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
import { validate } from '~/utils/validation'

const conversationRouter = Router()

conversationRouter.get(
  '/receiver/:receiverId',
  validate(accessTokenValidator),
  validate(verifiedUserValidator),
  validate(conversationIdValidator),
  validate(limitAndPageValidator),
  wrapAsync(getConversationController)
)

export default conversationRouter
