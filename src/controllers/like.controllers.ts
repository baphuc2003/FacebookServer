import e, { Request, Response, NextFunction } from 'express'
import likeService from '~/services/like.services'

export const likeController = async (req: Request, res: Response) => {
  const { user_id } = req.body
  const { post_id } = req.body
  await likeService.likeOfPost(user_id, post_id)
  return res.status(200).json({
    message: 'Have been liked the post successfully!'
  })
}

export const unlikeController = async (req: Request, res: Response) => {
  const { user_id } = req.body
  const { post_id } = req.body
  await likeService.removeLike(user_id, post_id)
  return res.status(200).json({
    message: 'Remove like of post successfully!'
  })
}
