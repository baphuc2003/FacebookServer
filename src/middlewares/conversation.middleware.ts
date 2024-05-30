import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import database from '~/services/database.services'

export const conversationIdValidator = checkSchema(
  {
    receiverId: {
      isMongoId: {
        errorMessage: 'invalid conversation_id'
      },
      custom: {
        options: async (value, { req }) => {
          const conversation = await database.conversation.findOne({
            receiver_id: new ObjectId(value)
          })

          if (!conversation) {
            throw new ErrorWithStatus({
              status: 404,
              message: 'Not found the conversation'
            })
          }
          return true
        }
      }
    }
  },
  ['params']
)

export const limitAndPageValidator = checkSchema(
  {
    limit: {
      isNumeric: true,
      custom: {
        options: (value, { req }) => {
          const limit = Number(value)
          if (!limit) {
            throw new ErrorWithStatus({
              status: 400,
              message: 'Limit is not empty'
            })
          }
          if (limit < 1 || limit > 100) {
            throw new ErrorWithStatus({
              status: 400,
              message: 'Limit must be 1 <= limit <=100'
            })
          }
          return true
        }
      }
    },
    page: {
      isNumeric: true,
      custom: {
        options: (value, { req }) => {
          const page = Number(value)
          if (!page) {
            throw new ErrorWithStatus({
              status: 400,
              message: 'Page is not empty'
            })
          }
          if (page <= 0) {
            throw new ErrorWithStatus({
              status: 400,
              message: 'Page must be >= 1'
            })
          }
          return true
        }
      }
    }
  },
  ['query']
)
