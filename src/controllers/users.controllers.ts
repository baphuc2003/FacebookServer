import e, { Request, Response, NextFunction } from 'express'
import { User } from '~/models/database/user'
import database from '~/services/database.services'
import userService from '~/services/users.services'
import { getDataCookie } from '~/utils/cookie'

export const registerController = async (req: Request, res: Response) => {
  const result = await userService.register(req.body)
  // //set cookie
  res.cookie('accessToken', `Bearer ${result.access_token}`, {
    maxAge: 15 * 60 * 1000,
    httpOnly: true
  })
  res.cookie('refreshToken', `${result.access_token}`, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true
  })
  res.cookie('user_id', `${result.user_id}`, {})
  return res.status(200).json({
    message: 'Register a new user successfully!',
    result
  })
}

export const loginController = async (req: Request, res: Response) => {
  const { _id } = req.user as User
  const result = await userService.login(_id?.toString() as string)
  // //set cookie
  res.cookie('accessToken', `Bearer ${result.access_token}`, {
    maxAge: 15 * 60 * 1000,
    httpOnly: true
  })
  res.cookie('refreshToken', `${result.access_token}`, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true
  })
  res.cookie('user_id', _id?.toString(), {})
  return res.status(200).json({
    message: 'Login successfully!',
    user_id: _id?.toString(),
    result
  })
}

export const logoutController = async (req: Request, res: Response) => {
  const dataCookie: string = req.headers?.cookie as string
  const user_id = getDataCookie(dataCookie)['user_id']
  const result = userService.logout(user_id as string)
  return res.status(200).json({
    message: 'Logout user successfully!'
  })
}

export const emailVerifyController = async (req: Request, res: Response) => {
  const dataCookie: string = req.headers?.cookie as string
  const user_id = getDataCookie(dataCookie)['user_id']
  const result = await userService.emailVerify(user_id as string)
  return res.status(200).json({
    message: 'Verify email successfully!',
    result
  })
}

export const forgotPasswordController = async (req: Request, res: Response) => {
  const userId = req.isEmail?._id?.toString()
  const email = req.isEmail?.email
  await userService.forgotPassword(userId as string, email as string)
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
  const dataCookie: string = req.headers?.cookie as string
  const user_id = getDataCookie(dataCookie)['user_id']
  const result = await userService.userProfile(user_id)
  return res.status(200).json({
    message: 'Get profile user success',
    result
  })
}

export const getProfilecontroller = async (req: Request, res: Response) => {
  const userId = req.params.userId
  const result = await userService.getProfile(userId)
  return res.status(200).json({
    message: `Get profile of ${userId} successfully!`,
    result
  })
}

export const getAllUser = async (req: Request, res: Response) => {
  const result = await database.users.find().toArray()
  return res.status(200).json({
    message: 'Get all user successfully',
    result
  })
}
