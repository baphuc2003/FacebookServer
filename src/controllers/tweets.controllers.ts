import e, { Request, Response, NextFunction } from 'express'

export const createPostController = async (req: Request, res: Response) => {
  return res.status(200).send('kakakak')
}
