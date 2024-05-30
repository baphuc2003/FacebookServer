import { ValidationChain, checkSchema } from 'express-validator'
import { ErrorWithStatus } from '~/models/Errors'
import userService from '~/services/users.services'
import bcrypt from 'bcrypt'
import database from '~/services/database.services'
import { decodeToken, verifyEmailToken } from '~/utils/jwt'
import { ObjectId } from 'mongodb'
import { StatusActivity } from '~/constants/enum'
import { Request, Response, NextFunction } from 'express'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import { getDataCookie } from '~/utils/cookie'

export const registerValidator = checkSchema(
  {
    firstName: {
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        options: {
          min: 1,
          max: 255
        }
      }
    },
    lastName: {
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        options: {
          min: 1,
          max: 255
        }
      }
    },
    email: {
      notEmpty: true,
      isString: true,
      isEmail: true,
      isLength: {
        options: {
          min: 3,
          max: 255
        }
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const result = await userService.checkEmailExist(value)
          console.log('check 47 ', result)
          if (result != null) throw new Error('Tài khoản email này đã được sử dụng trước đó. Vui lòng thử lai!')
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        options: {
          min: 6,
          max: 255
        }
      },
      isStrongPassword: {
        options: {
          minLowercase: 1,
          minUppercase: 1,
          minLength: 6,
          minNumbers: 1,
          minSymbols: 1
        }
      }
    },
    sex: {
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        options: {
          min: 4,
          max: 10
        }
      }
    }
  },
  ['body']
)
export const loginValidator = checkSchema(
  {
    email: {
      notEmpty: true,
      isString: true,
      isEmail: true,
      isLength: {
        options: {
          min: 3,
          max: 255
        }
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const user = await database.users.findOne({
            email: value
          })
          if (!user) {
            throw new Error('User not found')
          }

          const compare = bcrypt.compareSync(req.body.password, user.password)
          if (!compare) {
            //  throw new Error("Password doesn't correct")
            throw new ErrorWithStatus({ status: 422, message: 'Password bi nguu' })
          }
          req.user = user
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        options: {
          min: 6,
          max: 255
        }
      },
      custom: {
        options: async (value, { req }) => {}
      }
    }
  },
  ['body']
)

export const userIdValidator = checkSchema(
  {
    user_id: {
      custom: {
        options: async (value, { req }) => {
          const dataCookie: string = req.headers?.cookie
          const user_id = getDataCookie(dataCookie)['user_id']
          if (!user_id) {
            throw new ErrorWithStatus({
              status: 401,
              message: 'User id is required'
            })
          }
          const user = await database.users.findOne({ _id: new ObjectId(user_id) })
          if (!user) {
            throw new ErrorWithStatus({
              status: 404,
              message: 'User not found!'
            })
          }
          req.user_id = user_id
          return true
        }
      }
    }
  },
  ['headers']
)

export const userIdHeaderValidator = checkSchema(
  {
    user_id: {
      custom: {
        options: async (value, { req }) => {
          console.log('check 175 ', value)
          if (!value) {
            throw new ErrorWithStatus({
              status: 401,
              message: 'User id is required'
            })
          }
          const user = await database.users.findOne({ _id: new ObjectId(value) })
          if (!user) {
            throw new ErrorWithStatus({
              status: 404,
              message: 'User not found!'
            })
          }
          req.user_id = value
          return true
        }
      }
    }
  },
  ['headers']
)

export const userIdParamValidator = checkSchema(
  {
    userId: {
      custom: {
        options: async (value, { req }) => {
          if (!value) {
            throw new ErrorWithStatus({
              status: 401,
              message: 'User id is required'
            })
          }
          const user = await database.users.findOne({ _id: new ObjectId(value) })
          if (user == null) {
            throw new ErrorWithStatus({
              status: 404,
              message: 'User not found!'
            })
          }
          req.user_id = value
          return true
        }
      }
    }
  },
  ['params']
)

export const emailVerifyTokenValidator = checkSchema(
  {
    email_verify_token: {
      trim: true,
      custom: {
        options: async (value: string, { req }) => {
          console
          const dataCookie: string = req.headers?.cookie
          const userId = getDataCookie(dataCookie)['user_id']
          const user_id = new ObjectId(userId)

          //get public key
          const publicKey = await database.publicKey.findOne({ user_id: user_id })
          if (!publicKey) {
            throw new ErrorWithStatus({
              status: 401,
              message: 'User id is not defined!'
            })
          }

          if (!value) {
            throw new ErrorWithStatus({
              status: 401,
              message: 'Email verify token is required!'
            })
          }

          const decoded_email_verify_token = await verifyEmailToken({
            emailToken: value,
            secretKey: publicKey?.token as string
          })

          req.decoded_email_verify_token = decoded_email_verify_token
        }
      }
    }
  },
  ['body']
)

export const forgotPasswordValidator = checkSchema(
  {
    forgot_password: {
      custom: {
        options: (value, { req }) => {
          if (!value) {
            throw new Error('Password is not empty')
          }
        }
      },
      isStrongPassword: {
        options: {
          minLowercase: 1,
          minUppercase: 1,
          minLength: 6,
          minNumbers: 1,
          minSymbols: 1
        }
      }
    }
  },
  ['body']
)

export const changePasswordValidator = checkSchema(
  {
    password: {
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        options: {
          min: 6,
          max: 255
        }
      },
      isStrongPassword: {
        options: {
          minLowercase: 1,
          minUppercase: 1,
          minLength: 6,
          minNumbers: 1,
          minSymbols: 1
        }
      }
    },
    confirm_password: {
      custom: {
        options: (value, { req }) => {
          if (!value) {
            throw new Error('Confirm password is not empty')
          }
          //check confirm password equal with password
          const password = req.body.password
          if (value != password) {
            throw new Error("Confirm password doesn't match with password")
          }
          return true
        }
      }
    }
  },
  ['body']
)

export const checkEmailExist = checkSchema(
  {
    email: {
      custom: {
        options: async (value, { req }) => {
          if (!value) {
            throw new Error('Email is not empty!')
          }
          const isExist = await userService.checkEmailExist(value)
          if (!isExist) {
            throw new ErrorWithStatus({
              status: 404,
              message: "Email isn't exist!"
            })
          }
          req.isEmail = isExist
          return true
        }
      }
    }
  },
  ['body']
)

export const passwordValidator = checkSchema(
  {
    password: {
      isStrongPassword: {
        options: {
          minLowercase: 1,
          minUppercase: 1,
          minLength: 6,
          minNumbers: 1,
          minSymbols: 1
        }
      },
      custom: {
        options: (value, { req }) => {
          if (!value) {
            throw new Error('Password is not empty')
          }
          return true
        }
      }
    }
  },
  ['body']
)

export const verifiedUserValidator = checkSchema(
  {
    user_id: {
      custom: {
        options: async (value, { req }) => {
          const dataCookie: string = req.headers?.cookie
          const user_id = getDataCookie(dataCookie)['user_id']
          if (!user_id) {
            throw new ErrorWithStatus({
              status: 401,
              message: 'User id is not empty'
            })
          }
          const user = await database.users.findOne({ _id: new ObjectId(user_id) })
          if (!user) {
            throw new ErrorWithStatus({
              status: 404,
              message: 'User not found!!'
            })
          }

          if (user.status == StatusActivity.Unverify || user.status == StatusActivity.Banned) {
            throw new ErrorWithStatus({
              status: 403,
              message: 'Your account has not been verified or has been banned from access'
            })
          }
          return true
        }
      }
    }
  },
  ['headers']
)

export const followValidator = checkSchema(
  {
    followed_user_id: {
      custom: {
        options: async (value) => {
          if (!value) {
            throw new ErrorWithStatus({
              status: 401,
              message: 'Followed user id is not empty'
            })
          }
          const user = await database.users.findOne({ _id: new ObjectId(value) })
          if (!user) {
            throw new ErrorWithStatus({
              status: 404,
              message: 'The user has been followed not found!'
            })
          }
          return true
        }
      }
    }
  },
  ['body']
)

export const accessTokenValidator = checkSchema(
  {
    authorization: {
      custom: {
        options: async (value, { req }) => {
          const dataCookie: string = req.headers?.cookie
          const user_id = getDataCookie(dataCookie)['user_id']
          //get publicKey of user_id
          const publicKey = await database.publicKey.findOne({ user_id: new ObjectId(user_id) })
          if (!publicKey) {
            throw new ErrorWithStatus({
              status: 404,
              message: 'Public key not found!'
            })
          }
          const accessToken = decodeURIComponent(getDataCookie(dataCookie)['accessToken']).split(' ')[1]
          if (!accessToken) {
            throw new ErrorWithStatus({
              status: 401,
              message: 'Access token is not empty!'
            })
          }
          //decoded access token
          const decoded_access_token = await decodeToken({ token: accessToken, secretKey: publicKey.token })
          req.decoded_access_token = decoded_access_token
          return true
        }
      }
    }
  },
  ['headers']
)

export const refreshTokenValidator = checkSchema(
  {
    refreshToken: {
      custom: {
        options: async (value, { req }) => {
          const dataCookie: string = req.headers?.cookie
          const user_id = getDataCookie(dataCookie)['user_id']
          const refreshToken = getDataCookie(dataCookie)['refreshToken']
          if (!refreshToken) {
            throw new ErrorWithStatus({
              status: 401,
              message: 'Refresh token is not empty!'
            })
          }
          //get public key in database
          const publicKey = await database.publicKey.findOne({ user_id: new ObjectId(user_id) })
          if (!publicKey) {
            throw new ErrorWithStatus({
              status: 404,
              message: 'Public key not found!'
            })
          }
          //decoded_refresh_token in here
          const decoded_refresh_token = await decodeToken({ token: refreshToken, secretKey: publicKey.token })
          req.decoded_refresh_token = decoded_refresh_token
          return true
        }
      }
    }
  },
  ['body']
)

export const isUserLoggedValidator = (middleware: (req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataCookie = req.headers.cookie as string
    const isExistAccessToken = getDataCookie(dataCookie)['accessToken']
    if (isExistAccessToken) {
      return middleware(req, res, next)
    }
    next()
  }
}

export const checkForgotPasswordTokenValidator = checkSchema({
  forgot_password_token: {
    custom: {
      options: async (value, { req }) => {
        const user_id = req.headers?.user_id as string
        if (!value) {
          throw new ErrorWithStatus({
            status: 401,
            message: 'Forgot password token is not empty'
          })
        }
        //find token in database
        const user = await database.users.findOne({ _id: new ObjectId(user_id) })
        if (user?.forgotPasswordToken !== value) {
          throw new ErrorWithStatus({
            status: 404,
            message: 'Forgot password invalid'
          })
        }
        //get public key
        const publicKey = await database.publicKey.findOne({ user_id: new ObjectId(user_id) })
        if (!publicKey) {
          throw new ErrorWithStatus({
            status: 401,
            message: 'User id is not defined!'
          })
        }
        const decoded_forgot_password_token = await verifyEmailToken({
          emailToken: value,
          secretKey: publicKey?.token as string
        })

        req.decoded_forgot_password_token = decoded_forgot_password_token
      }
    }
  }
})
