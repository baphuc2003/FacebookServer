import { Bookmark } from '~/models/database/bookmark'
import database from './database.services'
import { ObjectId } from 'mongodb'

class BookMark {
  async createBookmark(user_id: string, post_id: string) {
    await database.bookMark.findOneAndUpdate(
      { user_id: new ObjectId(user_id), post_id: new ObjectId(post_id) },
      {
        $setOnInsert: new Bookmark({
          user_id: new ObjectId(user_id),
          post_id: new ObjectId(post_id)
        })
      },
      { upsert: true }
    )
  }

  async removeBookmark(user_id: string, post_id: string) {
    await database.bookMark.deleteOne({
      user_id: new ObjectId(user_id),
      post_id: new ObjectId(post_id)
    })
  }
}
const bookMark = new BookMark()
export default bookMark
