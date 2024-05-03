import { ObjectId } from 'mongodb'
import { Gender, StatusActivity } from '~/constants/enum'
export interface IUser {
  _id?: ObjectId
  firstName: string
  lastName: string
  email: string
  password: string
  numberPhone?: string
  birthDay?: string
  sex: Gender
  city?: string
  avatar?: string
  emailVerifyToken?: string
  forgotPasswordToken?: string
  created?: Date
  status?: StatusActivity
}

export class User {
  _id?: ObjectId
  firstName: string
  lastName: string
  email: string
  password: string
  numberPhone?: string
  birthDay?: string
  sex: Gender
  city?: string
  avatar?: string
  emailVerifyToken?: string
  forgotPasswordToken?: string
  created?: Date
  status?: StatusActivity

  constructor(user: IUser) {
    const date = new Date()
    this._id = user._id || new ObjectId()
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.email = user.email
    this.password = user.password
    this.numberPhone = user.numberPhone || ''
    this.birthDay = user.birthDay || ''
    this.sex = user.sex
    this.city = user.city || ''
    this.avatar = user.avatar ?? ''
    this.emailVerifyToken = user.emailVerifyToken || ''
    this.forgotPasswordToken = user.forgotPasswordToken || ''
    this.created = user.created || date
    this.status = user.status || StatusActivity.Unverify
  }
}
