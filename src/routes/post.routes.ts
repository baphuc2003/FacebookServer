import { Router } from 'express'
import { createPostController } from '~/controllers/tweets.controllers'
import { accessTokenValidator, userIdValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
import { validate } from '~/utils/validation'

const postRouter = Router()

postRouter.post(
  '/',
  validate(userIdValidator),
  validate(accessTokenValidator),
  validate(verifiedUserValidator),
  wrapAsync(createPostController)
)

export default postRouter
