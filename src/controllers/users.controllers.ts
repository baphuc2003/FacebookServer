import e, { Request, Response, NextFunction } from 'express'
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
  //set session
  req.session.accessToken = result.access_token
  return res.status(200).json({
    message: 'Login successfully!',
    result
  })
}

export const logoutController = async (req: Request, res: Response) => {
  const userId = req.user_id
  const result = userService.logout(userId as string)
  return res.status(200).json({
    message: 'Logout user successfully!'
  })
}

export const emailVerifyController = async (req: Request, res: Response) => {
  const result = await userService.emailVerify(req.user_id as string)
  return res.status(200).json({
    message: 'Verify email successfully!',
    result
  })
}

export const forgotPasswordController = async (req: Request, res: Response) => {
  const userId = req.isEmail?._id?.toString()
  const email = req.isEmail?.email
  const result = await userService.forgotPassword(userId as string, email as string)
  return res.status(200).json({
    message: 'Gởi email xác quên mật khẩu thành công'
  })
}

export const resetPasswordController = async (req: Request, res: Response) => {
  const password = req.body.password
  const userId = req.user_id
  await userService.resetPassword(password, userId as string)
  return res.status(200).json({
    message: 'Mật khẩu mới đã được cập nhật thành công'
  })
}

export const changePasswordController = async (req: Request, res: Response) => {
  const { confirm_password } = req.body
  await userService.changePassword(req.user_id as string, confirm_password)
  return res.status(200).json({
    message: 'Change password successfully!'
  })
}

export const followController = async (req: Request, res: Response) => {
  const result = await userService.followUser(req.user_id as string, req.body.followed_user_id)
  return res.status(200).json({
    message: result
  })
}

export const unFollowController = async (req: Request, res: Response) => {
  const result = await userService.unFollowUser(req.user_id as string, req.body.followed_user_id)
  return res.status(200).json({
    message: result
  })
}

export const userProfileController = async (req: Request, res: Response) => {
  const { userId } = req.params
  const result = await userService.userProfile(userId)
  return res.status(200).json({
    message: 'Get profile user success',
    result
  })
}
