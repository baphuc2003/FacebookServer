import { httpStatus } from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'

// type ErrorsType = Record<string,string> // ==> {[key : string] : string}
type ErrosType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>

export class ErrorWithStatus {
  status: number
  message: string

  constructor({ status, message }: { status: number; message: string }) {
    this.status = status
    this.message = message
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrosType
  constructor({ message = USERS_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrosType }) {
    super({ message, status: httpStatus.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
