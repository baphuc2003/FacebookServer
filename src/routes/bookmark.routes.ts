import { Router } from 'express'
import { createBookmarkController, unBookmarkController } from '~/controllers/bookmark.controllers'
import { accessTokenValidator, userIdValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
import { validate } from '~/utils/validation'

const bookmarkRouter = Router()

bookmarkRouter.post(
  '/create-book-mark',
  validate(userIdValidator),
  validate(accessTokenValidator),
  validate(verifiedUserValidator),
  wrapAsync(createBookmarkController)
)

bookmarkRouter.delete(
  '/remove-book-mark',
  validate(userIdValidator),
  validate(accessTokenValidator),
  validate(verifiedUserValidator),
  wrapAsync(unBookmarkController)
)

export default bookmarkRouter
