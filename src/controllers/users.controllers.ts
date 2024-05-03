import { Request, Response, NextFunction } from 'express'
import { User } from '~/models/database/user'
import userService from '~/services/users.services'

export const registerController = async (req: Request, res: Response) => {
  const result = await userService.register(req.body)
  return res.status(200).json({
    message: 'Register a new user successfully!',
    result
  })
}

export const loginController = async (req: Request, res: Response) => {
  const { _id } = req.user as User
  const result = await userService.login(_id?.toString() as string)
  return res.status(200).json({
    message: 'Login successfully!',
    result
  })
}

export const emailVerifyController = async (req: Request, res: Response) => {
  const result = await userService.emailVerify(req.user_id as string)
  return res.status(200).json({
    message: 'Verify email successfully!',
    result
  })
}
