import e, { Request, Response, NextFunction } from 'express'
import { IPostType, IRequestBodyPost, Post } from '~/models/database/post'
import postService from '~/services/post.services'
import { ParamsDictionary } from 'express-serve-static-core'

export const createPostController = async (req: Request<ParamsDictionary, any, IRequestBodyPost>, res: Response) => {
  const result = await postService.createPost(req.body, req.post as Post)
  return res.status(200).json({
    message: 'Create a new tweet successfully',
    result
  })
}

export const getPostchildrenController = async (req: Request, res: Response) => {
  const page = Number(req.query.page)
  const limit = Number(req.query.limit)
  const { result, total_page } = await postService.getPostChildren({
    post_id: req.params.post_id,
    post_type: req.query.post_type as IPostType,
    limit: Number(req.query.limit),
    page: page
  })
  return res.status(200).json({
    message: 'Get list post children successfully!',
    result: {
      page,
      limit,
      total_page: Math.ceil(total_page / limit),
      result
    }
  })
}

export const getNewPostController = async (req: Request, res: Response) => {
  const page = Number(req.query.page)
  const limit = Number(req.query.limit)
  const user_id = req.user_id as string
  const result = await postService.getNewPost({ id: user_id, limit, page })
  const newFeed = result.result[0].paginatedResults
  const total_page = result.result[0].total_new_feed[0].count
  // console.log('check 40 ', result)
  return res.status(200).json({
    message: 'Get new post successfully',
    limit,
    page,
    total_page: Math.ceil(total_page / limit),
    newFeed
  })
}

export const getPostController = async (req: Request, res: Response) => {
  const result = await postService.increaseView(Boolean(req.decoded_access_token), req.post?._id?.toString() as string)
  const post = {
    ...req.post,
    guest_view: result.guest_view,
    user_view: result.user_view
  }
  return res.status(200).json({
    message: 'Get post successfully!',
    post
  })
}
