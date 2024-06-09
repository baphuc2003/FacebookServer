import { Router } from 'express'
import { likeController, unlikeController } from '~/controllers/like.controllers'
import { postIdValidator } from '~/middlewares/post.middlewares'
import { accessTokenValidator, userIdValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
import { validate } from '~/utils/validation'

const likeRouter = Router()

likeRouter.post(
  '/like-post',
  validate(userIdValidator),
  validate(accessTokenValidator),
  validate(verifiedUserValidator),
  validate(postIdValidator),
  wrapAsync(likeController)
)

likeRouter.delete(
  '/unlike-post',
  validate(userIdValidator),
  validate(accessTokenValidator),
  validate(verifiedUserValidator),
  validate(postIdValidator),
  wrapAsync(unlikeController)
)

export default likeRouter
