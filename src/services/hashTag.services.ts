import { HashTag, IHashTag } from '~/models/database/hashtag'
import database from './database.services'
import { ObjectId } from 'mongodb'

class HashTags {
  // async checkHashTag(payload: string[]) {
  //   const hashTagsDocument = await Promise.all(
  //     payload?.map((item) => {
  //       return database.hashTags.findOneAndUpdate(
  //         { name: item },
  //         { $setOnInsert: new HashTag({ name: item }) },
  //         { upsert: true }
  //       )
  //     })
  //   )
  //   return hashTagsDocument
  // }

  async checkHashTag(payload: string[]) {
    const arrObjectIdHashTag: ObjectId[] = []
    const hashTagsDocument = await Promise.all(
      payload.map(async (item) => {
        const isHashTag = await database.hashTags.findOne({ name: item })
        if (isHashTag == null) {
          arrObjectIdHashTag.push((await database.hashTags.insertOne(new HashTag({ name: item }))).insertedId)
        } else {
          arrObjectIdHashTag.push(isHashTag._id)
        }
      })
    )
    return arrObjectIdHashTag
  }
}

const hashTag = new HashTags()
export default hashTag
