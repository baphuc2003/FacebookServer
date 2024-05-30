import { Request } from 'express'
import { User } from './models/database/user'
import RefreshToken from './models/database/refreshToken'
import { Post } from './models/database/post'
import { IDecodedAccessToken, IDecodedForgotPasswordToken } from './models/request/accessToken'
declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    //  decoded_refreshToken? : TokenPayload
    //  decoded_email_verify_token? : TokenPayload
    decoded_access_token?: IDecodedAccessToken
    user_id?: string
    isEmail?: User
    decoded_refresh_token?: RefreshToken
    post?: Post
    decoded_forgot_password_token?: IDecodedForgotPasswordToken
  }
}

declare module 'express-session' {
  interface SessionData {
    userId: string // Định nghĩa thuộc tính userId,
    accessToken: string
  }
}

declare module 'formidable' {
  namespace formidable {
    interface File {
      name: string | null
      originalFilename: string | null
      mimetype: string | null
      // Thêm các thuộc tính khác nếu cần
    }
  }
  const formidable: any
  export = formidable
}
