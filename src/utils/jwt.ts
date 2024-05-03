import jwt from 'jsonwebtoken'
import { ErrorWithStatus } from '~/models/Errors'

export const generateToken = ({
  payload,
  privateKey,
  option
}: {
  payload: string | object | Buffer
  privateKey: string
  option: jwt.SignOptions | undefined
}) => {
  const token = jwt.sign(payload, privateKey, option)
  return token
}

export const verifyEmailToken = ({ emailToken, secretKey }: { emailToken: string; secretKey: string }) => {
  return new Promise((resolve, reject) => {
    jwt.verify(emailToken, secretKey, (err, decoded) => {
      if (err) {
        return reject(
          new ErrorWithStatus({
            status: 409,
            message: 'Email already verify before!'
          })
        )
      }
      resolve(decoded)
    })
  })
}
