import e, { Request, Response, NextFunction } from 'express'
import { IRequestBodyPost } from '~/models/database/post'
import postService from '~/services/post.services'
import { ParamsDictionary } from 'express-serve-static-core'

export const createPostController = async (req: Request<ParamsDictionary, any, IRequestBodyPost>, res: Response) => {
  const result = await postService.createPost(req.body)
  return res.status(200).json({
    message: 'Create a new tweet successfully',
    result
  })
}

export const getPostController = async (req: Request, res: Response) => {
  const result = await postService.increaseView(Boolean(req.decoded_access_token), req.post?._id?.toString() as string)
  return res.status(200).json({
    message: 'Get post successfully!',
    result
  })
}

// export const increaseViewPostController = async (req: Request, res: Response) => {
//   const result = await postService.increaseView()
//   return res.status(200).json({
//     message: 'Increase view of the post sucessfully!'
//   })
// }
