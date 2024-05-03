import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import { EntityError, ErrorWithStatus } from '~/models/Errors'
import express from 'express'
import { httpStatus } from '~/constants/httpStatus'

const entityError = new EntityError({ errors: {} })

export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validations.run(req)
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const errorObject = errors.mapped()
    console.log('check inline 17 ', errorObject)
    for (const key in errorObject) {
      const { msg } = errorObject[key]
      if (msg instanceof ErrorWithStatus && msg.status !== httpStatus.UNPROCESSABLE_ENTITY) {
        console.log('check inline 22 ', msg)
        return next(msg)
      }
      entityError.errors[key] = errorObject[key]
    }
    next(entityError)
  }
}
