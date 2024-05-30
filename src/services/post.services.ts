import { IRequestBodyPost, Post } from '~/models/database/post'
import database from './database.services'
import { ObjectId } from 'mongodb'
import hashTag from './hashTag.services'

class PostServices {
  async createPost(payload: IRequestBodyPost) {
    const arrHashTags = await hashTag.checkHashTag(payload.hashtags)
    // const hashtagObjectIds: ObjectId[] = arrHashTags.filter((item) => item !== null).map((item) => item!._id)
    const post = await database.post.insertOne(
      new Post({
        user_id: new ObjectId(payload.user_id),
        type: payload.type,
        audience: payload.audience,
        parent_id: payload.parent_id,
        content: payload.content,
        hashtags: arrHashTags,
        mentions: payload.mentions,
        media: payload.media
      })
    )
    return post
  }

  async increaseView(isExistAccessToken: boolean, post_id: string) {
    const isPostId = isExistAccessToken ? { user_view: 1 } : { guest_view: 1 }
    const post = await database.post.findOneAndUpdate(
      { _id: new ObjectId(post_id) },
      { $inc: isPostId },
      {
        returnDocument: 'after'
      }
    )
    return post
  }
}

const postService = new PostServices()
export default postService
