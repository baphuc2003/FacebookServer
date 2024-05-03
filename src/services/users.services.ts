import { IUser, User } from '~/models/database/user'
import database from './database.services'
import { ObjectId } from 'mongodb'
import { generateKey } from '~/utils/crypto'
import { generateToken } from '~/utils/jwt'
import { StatusActivity, TokenType } from '~/constants/enum'
import RefreshToken from '~/models/database/refreshToken'
import PublicKey from '~/models/database/publicKey'
import { hashPassword } from '~/utils/bcrypt'
import { sendVerifyRegisterEmail } from '~/utils/email'
import { ErrorWithStatus } from '~/models/Errors'
// import { sendVerifyEmail } from '~/utils/email'

class UsersServices {
  async register(payload: IUser) {
    const user_id = new ObjectId()
    const { privateKey, publicKey } = generateKey()
    //Create email_verify_token
    const email_verify_token = generateToken({
      payload: {
        user_id: user_id,
        token_type: TokenType.EmailVerifyToken
      },
      privateKey,
      option: {
        expiresIn: '1h',
        algorithm: 'RS256'
      }
    })
    //hash password
    const hash_password = await hashPassword(payload.password)
    //upgrade new user
    const new_user = await database.users.insertOne(
      new User({
        _id: user_id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: hash_password,
        sex: payload.sex,
        emailVerifyToken: email_verify_token
      })
    )

    //Create access_token and refresh_token
    const access_token = generateToken({
      payload: {
        user_id: user_id,
        token_type: TokenType.AccessToken
      },
      privateKey,
      option: {
        expiresIn: '15m',
        algorithm: 'RS256'
      }
    })

    const refresh_token = generateToken({
      payload: {
        user_id: user_id,
        token_type: TokenType.RefreshToken
      },
      privateKey,
      option: {
        expiresIn: '30d',
        algorithm: 'RS256'
      }
    })

    try {
      // Save refresh_token and public_key
      await Promise.all([
        database.refreshToken.insertOne(
          new RefreshToken({
            user_id: user_id,
            token: refresh_token
          })
        ),
        database.publicKey.insertOne(
          new PublicKey({
            user_id: user_id,
            token: publicKey
          })
        )
      ])
    } catch (error) {
      console.log(error)
      throw new Error('Failed to save refresh token and public key')
    }

    // sendVerifyEmail(
    //   'conganuong999@gmail.com',
    //   `<h1>Verify your email</h1>`,
    //   `${process.env.CLIENT_URL}/verify-your-email?token=${email_verify_token}`
    // )
    sendVerifyRegisterEmail('conganuong999@gmail.com', email_verify_token, user_id.toString())

    return {
      access_token,
      refresh_token
    }
  }

  async login(user_id: string) {
    const { privateKey, publicKey } = generateKey()
    //Create access_token and refresh_token
    const access_token = generateToken({
      payload: {
        user_id: user_id,
        token_type: TokenType.AccessToken
      },
      privateKey,
      option: {
        expiresIn: '15m',
        algorithm: 'RS256'
      }
    })

    const refresh_token = generateToken({
      payload: {
        user_id: user_id,
        token_type: TokenType.RefreshToken
      },
      privateKey,
      option: {
        expiresIn: '30d',
        algorithm: 'RS256'
      }
    })

    //update new publicKey and refreshToken
    try {
      const updatedDocuments = await Promise.all([
        database.refreshToken.findOneAndUpdate({ user_id: new ObjectId(user_id) }, { $set: { token: refresh_token } }),
        database.publicKey.findOneAndUpdate({ user_id: new ObjectId(user_id) }, { $set: { token: publicKey } })
      ])
    } catch (error) {
      console.log(error)
    }

    //return access_token and refresh_token
    return {
      access_token,
      refresh_token
    }
  }

  async checkEmailExist(email: string) {
    const user = await database.users.findOne({ email })
    return Boolean(user)
  }

  async emailVerify(user_id: string) {
    const user = await database.users.findOne({ _id: new ObjectId(user_id) })
    if (!user) {
      throw new ErrorWithStatus({
        status: 401,
        message: 'User id is not defined!'
      })
    }
    //đã verify rồi và sẽ trả về status OK và msg : "Đã verify trước đó rồi"
    if (user.emailVerifyToken === '') {
      throw new ErrorWithStatus({
        status: 200,
        message: 'Email already verify before!'
      })
    }

    //update update emailVerifyToken = "" and status of user
    await database.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          emailVerifyToken: '',
          status: StatusActivity.Verified
        }
      }
    )

    //create new two key
    const { privateKey, publicKey } = generateKey()

    //create access_token,refresh_token and update emailVerifyToken = ""
    const access_token = generateToken({
      payload: {
        user_id: user_id,
        token_type: TokenType.AccessToken
      },
      privateKey,
      option: {
        expiresIn: '15m',
        algorithm: 'RS256'
      }
    })

    const refresh_token = generateToken({
      payload: {
        user_id: user_id,
        token_type: TokenType.RefreshToken
      },
      privateKey,
      option: {
        expiresIn: '30d',
        algorithm: 'RS256'
      }
    })

    //Save new refresh token and public key in database
    try {
      await Promise.all([
        database.refreshToken.updateOne(
          { user_id: new ObjectId(user_id) },
          {
            $set: {
              token: refresh_token
            }
          }
        ),
        database.publicKey.updateOne(
          { user_id: new ObjectId(user_id) },
          {
            $set: {
              token: publicKey
            }
          }
        )
      ])
    } catch (error) {
      console.log(error)
    }

    return {
      access_token,
      refresh_token
    }
  }
}

const userService = new UsersServices()
export default userService
