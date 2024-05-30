import { Router } from 'express'
import {
  changePasswordController,
  emailVerifyController,
  followController,
  forgotPasswordController,
  getAllUser,
  getProfilecontroller,
  loginController,
  logoutController,
  registerController,
  resetPasswordController,
  unFollowController,
  userProfileController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  changePasswordValidator,
  checkEmailExist,
  checkForgotPasswordTokenValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  passwordValidator,
  refreshTokenValidator,
  registerValidator,
  userIdHeaderValidator,
  userIdParamValidator,
  userIdValidator,
  verifiedUserValidator
} from '~/middlewares/users.middlewares'
import { validate } from '~/utils/validation'
import { wrapAsync } from '~/utils/handlers'
const usersRouter = Router()

usersRouter.post('/register', validate(registerValidator), wrapAsync(registerController))

usersRouter.post('/login', validate(loginValidator), wrapAsync(loginController))

usersRouter.post(
  '/logout',
  validate(accessTokenValidator),
  validate(refreshTokenValidator),
  wrapAsync(logoutController)
)

usersRouter.post(
  '/verify-email',
  validate(userIdValidator),
  validate(emailVerifyTokenValidator),
  wrapAsync(emailVerifyController)
)

usersRouter.post('/forgot-password', validate(checkEmailExist), wrapAsync(forgotPasswordController))

usersRouter.put(
  '/change-password',
  validate(userIdHeaderValidator),
  validate(checkForgotPasswordTokenValidator),
  validate(changePasswordValidator),
  wrapAsync(changePasswordController)
)

usersRouter.post(
  '/reset-password',
  validate(passwordValidator),
  validate(userIdValidator),
  wrapAsync(resetPasswordController)
)

usersRouter.post(
  '/follow',
  validate(userIdValidator),
  validate(accessTokenValidator),
  validate(verifiedUserValidator),
  validate(followValidator),
  wrapAsync(followController)
)

usersRouter.post(
  '/unfollow',
  validate(userIdValidator),
  validate(accessTokenValidator),
  validate(followValidator),
  wrapAsync(unFollowController)
)

usersRouter.get(
  '/me',
  validate(accessTokenValidator),
  validate(verifiedUserValidator),
  wrapAsync(userProfileController)
)

usersRouter.get('/get-profile/:userId', validate(userIdParamValidator), wrapAsync(getProfilecontroller))

usersRouter.get('/get-all-user', wrapAsync(getAllUser))

export default usersRouter
