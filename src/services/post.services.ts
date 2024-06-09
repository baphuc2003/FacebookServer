import { IPostType, IRequestBodyPost, Post } from '~/models/database/post'
import database from './database.services'
import { ObjectId } from 'mongodb'
import hashTag from './hashTag.services'

class PostServices {
  async createPost(payload: IRequestBodyPost, post: Post) {
    const arrHashTags = await hashTag.checkHashTag(payload.hashtags)

    switch (payload.type.toLowerCase()) {
      case IPostType.Post.toLowerCase(): {
        return await database.post.insertOne(
          new Post({
            user_id: new ObjectId(payload.user_id),
            type: payload.type,
            audience: payload.audience,
            post_circle: payload.post_circle,
            parent_id: payload.parent_id,
            content: payload.content,
            hashtags: arrHashTags,
            mentions: payload.mentions,
            media: payload.media
          })
        )
      }

      case IPostType.Comment.toLowerCase(): {
        const [newPost, oldPost] = await Promise.all([
          database.post.insertOne(
            new Post({
              user_id: new ObjectId(payload.user_id),
              type: payload.type,
              audience: payload.audience,
              post_circle: payload.post_circle,
              parent_id: payload.parent_id,
              content: payload.content,
              hashtags: arrHashTags,
              mentions: payload.mentions,
              media: payload.media
            })
          ),
          database.post.updateOne(
            {
              _id: post._id,
              user_id: new ObjectId(payload.user_id)
            },
            {
              $inc: {
                comment_post_count: 1
              }
            }
          )
        ])
        return newPost
      }

      case IPostType.Retpost.toLowerCase(): {
        const [newPost, oldPost] = await Promise.all([
          database.post.insertOne(
            new Post({
              user_id: new ObjectId(payload.user_id),
              type: payload.type,
              audience: payload.audience,
              post_circle: payload.post_circle,
              parent_id: payload.parent_id,
              content: payload.content,
              hashtags: arrHashTags,
              mentions: payload.mentions,
              media: payload.media
            })
          ),
          database.post.updateOne(
            {
              _id: post._id,
              user_id: new ObjectId(payload.user_id)
            },
            {
              $inc: {
                re_post_count: 1
              }
            }
          )
        ])
        return newPost
      }

      case IPostType.QoutePost.toLowerCase(): {
        const [newPost, oldPost] = await Promise.all([
          database.post.insertOne(
            new Post({
              user_id: new ObjectId(payload.user_id),
              type: payload.type,
              audience: payload.audience,
              post_circle: payload.post_circle,
              parent_id: payload.parent_id,
              content: payload.content,
              hashtags: arrHashTags,
              mentions: payload.mentions,
              media: payload.media
            })
          ),
          database.post.updateOne(
            {
              _id: post._id,
              user_id: new ObjectId(payload.user_id)
            },
            {
              $inc: {
                quote_post_count: 1
              }
            }
          )
        ])
        return newPost
      }
      default:
        throw new Error(`Unsupported post type: ${payload.type}`)
    }
  }

  async increaseView(isExistAccessToken: boolean, post_id: string) {
    const isPostId = isExistAccessToken ? { user_view: 1 } : { guest_view: 1 }
    const post = await database.post.findOneAndUpdate(
      { _id: new ObjectId(post_id) },
      { $inc: isPostId },
      {
        returnDocument: 'after',
        projection: {
          guest_view: 1,
          user_view: 1
        }
      }
    )
    return post as {
      guest_view: number
      user_view: number
    }
  }

  async getPostChildren({
    post_id,
    post_type,
    limit,
    page
  }: {
    post_id: string
    post_type: IPostType
    limit: number
    page: number
  }) {
    const result = await database.post
      .aggregate<Post>([
        {
          $match: {
            parent_id: new ObjectId(post_id)
          }
        },
        { $match: { type: post_type } },
        {
          $lookup: {
            from: 'hashtags',
            localField: 'hashtags',
            foreignField: '_id',
            as: 'hashtags'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'mentions',
            foreignField: '_id',
            as: 'mentions'
          }
        },
        {
          $project: {
            mentions: {
              password: 0,
              emailVerifyToken: 0,
              forgotPasswordToken: 0
            }
          }
        },
        { $skip: limit * (page - 1) },
        { $limit: limit }
      ])
      .toArray()
    //imcrease view for post
    const ids = result.map((item) => item._id as ObjectId)
    await database.post.updateMany(
      {
        _id: {
          $in: ids
        }
      },
      {
        $inc: {
          user_view: 1
        }
      }
    )
    const total_page = await database.post.countDocuments({
      parent_id: new ObjectId(post_id),
      type: post_type
    })

    result.forEach((item) => {
      if (item.user_view !== undefined) {
        item.user_view += 1
      }
    })

    return {
      result,
      total_page
    }
  }

  async getNewPost({ id, limit, page }: { id: string; limit: number; page: number }) {
    const result = await database.post
      .aggregate([
        {
          $match: {
            user_id: {
              $in: [new ObjectId(id)]
            }
          }
        },
        {
          $lookup: {
            from: 'hashtags',
            localField: 'hashtags',
            foreignField: '_id',
            as: 'hashtags'
          }
        },
        {
          $lookup: {
            from: 'mentions',
            localField: 'mentions',
            foreignField: '_id',
            as: 'mentions'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user_id'
          }
        },
        {
          $project: {
            user_id: {
              password: 0,
              emailVerifyToken: 0,
              forgotPasswordToken: 0
            }
          }
        },
        {
          $lookup: {
            from: 'follow',
            localField: 'user_id._id',
            foreignField: 'user_id',
            as: 'follow'
          }
        },
        {
          $lookup: {
            from: 'post',
            localField: 'follow.followed_user_id',
            foreignField: 'user_id',
            as: 'post_of_followed'
          }
        },
        {
          $match: {
            $or: [
              {
                audience: 'everyone'
              },
              {
                audience: 'postcircle'
              }
            ]
          }
        },
        {
          $group: {
            _id: null,
            post_of_user: {
              $push: '$$ROOT'
            }
          }
        },
        {
          $project: {
            _id: 0
          }
        },
        {
          $addFields: {
            singleItem: {
              $arrayElemAt: ['$post_of_user', 0]
            }
          }
        },
        {
          $project: {
            post_of_user: 1,
            'singleItem.post_of_followed': 1
          }
        },
        {
          $project: {
            'post_of_user.follow': 0,
            'post_of_user.post_of_followed': 0
          }
        },
        {
          $project: {
            post_of_user: 1,
            'singleItem.post_of_followed': {
              $filter: {
                input: '$singleItem.post_of_followed',
                as: 'item',
                cond: {
                  $or: [
                    {
                      $eq: ['$$item.audience', 'everyone']
                    },
                    {
                      $and: [
                        {
                          $eq: ['$$item.audience', 'postcircle']
                        },
                        {
                          $in: [new ObjectId(id), '$$item.post_circle']
                        }
                      ]
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $addFields: {
            new_feed: {
              $concatArrays: ['$post_of_user', '$singleItem.post_of_followed']
            }
          }
        },
        {
          $project: {
            post_of_user: 0,
            singleItem: 0
          }
        },
        {
          $unwind: {
            path: '$new_feed',
            includeArrayIndex: 'postIndex',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $sort: {
            'new_feed.created_at': -1
          }
        },
        {
          $group: {
            _id: null,
            list_new_feed: {
              $push: '$$ROOT'
            }
          }
        },
        {
          $project: {
            _id: 0
          }
        }
      ])
      .toArray()

    return {
      result
    }
  }
}

const postService = new PostServices()
export default postService
