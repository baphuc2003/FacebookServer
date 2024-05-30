import { TokenType } from '~/constants/enum'

export interface IDecodedAccessToken {
  user_id: string
  token_type: TokenType.AccessToken
  iat: number
  exp: number
}

export interface IDecodedForgotPasswordToken {
  user_id: string
  token_type: TokenType.AccessToken
  iat: number
  exp: number
}
