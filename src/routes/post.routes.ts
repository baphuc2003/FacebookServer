import { Router } from 'express'
import { createPostController, getPostController } from '~/controllers/tweets.controllers'
import { createPostValidator, postCircleValidator, postIdValidator } from '~/middlewares/post.middlewares'
import {
  accessTokenValidator,
  isUserLoggedValidator,
  userIdValidator,
  verifiedUserValidator
} from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
import { validate } from '~/utils/validation'

const postRouter = Router()

postRouter.post(
  '/create-post',
  validate(userIdValidator),
  validate(accessTokenValidator),
  validate(verifiedUserValidator),
  validate(createPostValidator),
  wrapAsync(createPostController)
)

postRouter.get(
  '/:post_id',
  validate(postIdValidator),
  isUserLoggedValidator(validate(userIdValidator)),
  isUserLoggedValidator(validate(accessTokenValidator)),
  postCircleValidator,
  wrapAsync(getPostController)
)
export default postRouter
