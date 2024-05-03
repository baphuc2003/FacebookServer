import { Router } from 'express'
import { emailVerifyController, loginController, registerController } from '~/controllers/users.controllers'
import {
  emailVerifyTokenValidator,
  loginValidator,
  registerValidator,
  userIdValidator
} from '~/middlewares/users.middlewares'
import { validate } from '~/utils/validation'
import { wrapAsync } from '~/utils/handlers'
const usersRouter = Router()

usersRouter.post('/register', validate(registerValidator), wrapAsync(registerController))

usersRouter.post('/login', validate(loginValidator), wrapAsync(loginController))

usersRouter.post(
  '/verify-email',
  validate(userIdValidator),
  validate(emailVerifyTokenValidator),
  wrapAsync(emailVerifyController)
)

export default usersRouter
