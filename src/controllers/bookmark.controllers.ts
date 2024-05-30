import e, { Request, Response, NextFunction } from 'express'
import bookMark from '~/services/bookmark.services'
export const createBookmarkController = async (req: Request, res: Response) => {
  const { user_id } = req.body
  const { post_id } = req.body
  await bookMark.createBookmark(user_id, post_id)
  return res.status(200).json({
    message: 'Create a new bookmark successfully!'
  })
}

export const unBookmarkController = async (req: Request, res: Response) => {
  const { user_id } = req.body
  const { post_id } = req.body
  await bookMark.removeBookmark(user_id, post_id)
  return res.status(200).json({
    message: 'Remove book mark successfully!'
  })
}
