import { Router } from 'express'
import { likeController, unlikeController } from '~/controllers/like.controllers'
import { accessTokenValidator, userIdValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
import { validate } from '~/utils/validation'

const likeRouter = Router()

likeRouter.post(
  '/like-post',
  validate(userIdValidator),
  validate(accessTokenValidator),
  validate(verifiedUserValidator),
  wrapAsync(likeController)
)

likeRouter.delete(
  '/unlike-post',
  validate(userIdValidator),
  validate(accessTokenValidator),
  validate(verifiedUserValidator),
  wrapAsync(unlikeController)
)

export default likeRouter
