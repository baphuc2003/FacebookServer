import { Request, Response, NextFunction } from 'express'
export const wrapAsync = (func: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
