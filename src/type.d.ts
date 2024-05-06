import { Request } from 'express'
import { User } from './models/database/user'
import RefreshToken from './models/database/refreshToken'
declare module 'express' {
  interface Request {
    user?: User
    //  decoded_authorization? : TokenPayload
    //  decoded_refreshToken? : TokenPayload
    //  decoded_email_verify_token? : TokenPayload
    user_id?: string
    isEmail?: User
    decoded_refresh_token?: RefreshToken
  }
}

declare module 'express-session' {
  interface SessionData {
    userId: string // Định nghĩa thuộc tính userId,
    accessToken: string
  }
}
