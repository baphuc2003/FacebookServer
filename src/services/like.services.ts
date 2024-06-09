import { ObjectId } from 'mongodb'
import database from './database.services'
import { Like } from '~/models/database/like'

class LikeServices {
  async likeOfPost(user_id: string, post_id: string) {
    const result = await database.like.findOneAndUpdate(
      { user_id: new ObjectId(user_id), post_id: new ObjectId(post_id) },
      {
        $set: {
          user_id: new ObjectId(user_id),
          post_id: new ObjectId(post_id)
        }
      },
      { upsert: true }
    )
    console.log('check 17 ', result)
    if (result == null) {
      database.post.findOneAndUpdate(
        { _id: new ObjectId(post_id) },
        {
          $inc: {
            like: 1
          }
        }
      )
    }
  }

  async removeLike(user_id: string, post_id: string) {
    const result = await database.like.deleteOne({
      user_id: new ObjectId(user_id),
      post_id: new ObjectId(post_id)
    })

    if (result.deletedCount === 1) {
      database.post.findOneAndUpdate(
        { _id: new ObjectId(post_id) },
        {
          $inc: {
            like: -1
          }
        }
      )
    }
  }
}

const likeService = new LikeServices()
export default likeService
