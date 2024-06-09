import { Router } from 'express'
import {
  createPostController,
  getNewPostController,
  getPostController,
  getPostchildrenController
} from '~/controllers/tweets.controllers'
import {
  createPostValidator,
  idPostValidator,
  paginationValidator,
  postCircleValidator,
  postIdValidator
} from '~/middlewares/post.middlewares'
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
  validate(idPostValidator),
  wrapAsync(createPostController)
)

postRouter.get(
  '/children/:post_id',
  validate(postIdValidator),
  isUserLoggedValidator(validate(userIdValidator)),
  isUserLoggedValidator(validate(accessTokenValidator)),
  postCircleValidator,
  wrapAsync(getPostchildrenController)
)

postRouter.get(
  '/new-post',
  validate(userIdValidator),
  validate(accessTokenValidator),
  validate(paginationValidator),
  wrapAsync(getNewPostController)
)

// postRouter.get('/get-list-post', wrapAsync(getListPostController))
export default postRouter
