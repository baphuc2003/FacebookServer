import { checkSchema } from 'express-validator'
import { ErrorWithStatus } from '~/models/Errors'
import userService from '~/services/users.services'
import bcrypt from 'bcrypt'
import database from '~/services/database.services'
import { verifyEmailToken } from '~/utils/jwt'
import { ObjectId } from 'mongodb'

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
          if (result) throw new Error('Tài khoản email này đã được sử dụng trước đó. Vui lòng thử lai!')
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
        options: (value, { req }) => {
          console.log('check 141 ', value)
          console.log('check 142 ', req.body)
          if (!value) {
            throw new ErrorWithStatus({
              status: 401,
              message: 'User id is required'
            })
          }
          req.user_id = value
          return true
        }
      }
    }
  },
  ['body']
)

export const emailVerifyTokenValidator = checkSchema(
  {
    token: {
      trim: true,
      custom: {
        options: async (value: string, { req }) => {
          const user_id = new ObjectId(req.user_id)

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
