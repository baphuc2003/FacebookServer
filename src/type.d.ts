import { Request } from 'express'
import { User } from './models/database/user'
declare module 'express' {
  interface Request {
    user?: User
    //  decoded_authorization? : TokenPayload
    //  decoded_refreshToken? : TokenPayload
    //  decoded_email_verify_token? : TokenPayload
    user_id?: string
  }
}
