import { Router } from 'express'
import {
  uploadMutipleImageController,
  uploadSingleImageController,
  uploadVideoController,
  uploadVideoHLSController
} from '~/controllers/media.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
import { validate } from '~/utils/validation'

const mediaRouter = Router()

mediaRouter.post(
  '/upload-multiple-image',
  // validate(accessTokenValidator),
  // validate(verifiedUserValidator),
  wrapAsync(uploadMutipleImageController)
)

mediaRouter.post(
  '/upload-single-image',
  // validate(accessTokenValidator),
  // validate(verifiedUserValidator),
  wrapAsync(uploadSingleImageController)
)

mediaRouter.post(
  '/upload-video',
  // validate(accessTokenValidator),
  // validate(verifiedUserValidator),
  wrapAsync(uploadVideoController)
)

mediaRouter.post(
  '/upload-video-hls',
  // validate(accessTokenValidator),
  // validate(verifiedUserValidator),
  wrapAsync(uploadVideoHLSController)
)

export default mediaRouter
