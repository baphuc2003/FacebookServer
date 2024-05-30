import { ObjectId } from 'mongodb'
import database from './database.services'
import { Like } from '~/models/database/like'

class LikeServices {
  async likeOfPost(user_id: string, post_id: string) {
    await database.like.findOneAndUpdate(
      { user_id: new ObjectId(user_id), post_id: new ObjectId(post_id) },
      {
        $setOnInsert: new Like({
          user_id: new ObjectId(user_id),
          post_id: new ObjectId(post_id)
        })
      },
      { upsert: true }
    )
  }

  async removeLike(user_id: string, post_id: string) {
    await database.like.deleteOne({
      user_id: new ObjectId(user_id),
      post_id: new ObjectId(post_id)
    })
  }
}

const likeService = new LikeServices()
export default likeService
