import { checkSchema } from 'express-validator'
import { ErrorWithStatus } from '~/models/Errors'
import { IPostType, IPostAudience, IMediaType, Post } from '~/models/database/post'
import _, { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import database from '~/services/database.services'
import { Request, Response, NextFunction } from 'express'
import { wrapAsync } from '~/utils/handlers'
import { StatusActivity } from '~/constants/enum'

export const createPostValidator = checkSchema(
  {
    type: {
      custom: {
        options: (value: string, { req }) => {
          if (!value) {
            throw new ErrorWithStatus({
              status: 400,
              message: "Type of post isn't empty"
            })
          }
          const lowerValue = value.toLowerCase()

          const postTypesArray: string[] = Object.values(IPostType)

          //check type of post with IPostType
          let iExistType = false

          for (let i = 0; i < postTypesArray.length; i++) {
            if (postTypesArray[i].toLowerCase() === lowerValue) {
              return true
            } else {
              iExistType = true
            }
          }

          if (iExistType) {
            throw new ErrorWithStatus({
              status: 400,
              message: "Type of post isn't valid"
            })
          }
          console.log('kakak')
          return true
        }
      }
    },
    audience: {
      custom: {
        options: (value: string, { req }) => {
          if (!value) {
            throw new ErrorWithStatus({
              status: 400,
              message: "Audience of post isn't empty"
            })
          }
          const lowerValue = value.toLowerCase()
          const postAudiencesArray: string[] = Object.values(IPostAudience)
          //check type of post with IPostType
          let iExistAudience = false
          for (let i = 0; i < postAudiencesArray.length; i++) {
            if (postAudiencesArray[i].toLowerCase() === lowerValue) {
              return true
            } else {
              iExistAudience = true
            }
          }
          if (iExistAudience) {
            throw new ErrorWithStatus({
              status: 400,
              message: "Audience of post isn't valid"
            })
          }
          return true
        }
      }
    },
    post_circle: {
      custom: {
        options: async (value: string[], { req }) => {
          const type: string = req.body.type
          const audience: string = req.body.audience
          if (
            type.toLowerCase() === IPostType.Post.toLowerCase() &&
            audience.toLowerCase() === IPostAudience.PostCircle.toLowerCase()
          ) {
            if (!Array.isArray(value)) {
              throw new ErrorWithStatus({
                status: 400,
                message: 'Post circle must be a array'
              })
            }
            if (value.length === 0) {
              throw new ErrorWithStatus({
                status: 400,
                message: 'There must be at least 1 person!'
              })
            } else if (value.length > 50) {
              throw new ErrorWithStatus({
                status: 400,
                message: 'Maximum person is 50'
              })
            }

            for (const item of value) {
              const user = await database.users.findOne({
                _id: new ObjectId(item)
              })
              if (!user) {
                throw new ErrorWithStatus({
                  status: 404,
                  message: `Not found user_id: ${item}`
                })
              }
            }
          }

          if (
            type.toLowerCase() === IPostType.Post.toLowerCase() &&
            audience.toLowerCase() === IPostAudience.Everyone.toLowerCase()
          ) {
            throw new ErrorWithStatus({
              status: 400,
              message: 'Post circle must be a empty array'
            })
          }
          return true
        }
      }
    },
    parent_id: {
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as string
          const postTypesArray: string[] = Object.values(IPostType)
          //['Post','Repost','QuotePost','Comment'] ----> ['Repost','QuotePost','Comment']
          if (
            _.without(postTypesArray, 'Post')
              .map((item) => item.toLowerCase())
              .includes(type.toLowerCase()) &&
            !ObjectId.isValid(value)
          ) {
            throw new ErrorWithStatus({
              status: 401,
              message: 'Parent id must be a post id'
            })
          }

          if (type.toLowerCase() === 'post' && !((value === 'null' ? null : value) == null)) {
            throw new ErrorWithStatus({
              status: 400,
              message: 'Parent id must be a null'
            })
          }

          if (
            type.toLowerCase() === IPostType.Retpost.toLowerCase() &&
            type.toLowerCase() === IPostType.QoutePost.toLowerCase() &&
            value === req.user_id
          ) {
            throw new ErrorWithStatus({
              status: 403,
              message: 'You cannot share your own posts'
            })
          }

          return true
        }
      }
    },
    content: {
      custom: {
        options: (value: string, { req }) => {
          const hashtags = req.body.hashtags as string[]
          const mentions = req.body.mentions as string[]
          const type = req.body.type as string
          const postTypesArray: string[] = Object.values(IPostType)

          //if type is one in array here ['Post','QoutePost','Comment']
          if (
            _.without(postTypesArray, 'Repost')
              .map((item) => item.toLowerCase())
              .includes(type.toLowerCase()) &&
            isEmpty(hashtags) &&
            isEmpty(mentions) &&
            typeof value !== 'string'
          ) {
            throw new ErrorWithStatus({
              status: 400,
              message: 'Content must be a string'
            })
          }
          //if type is Repost
          if (type.toLowerCase() === 'repost' && value !== null) {
            throw new ErrorWithStatus({
              status: 400,
              message: 'Content must be null'
            })
          }
          return true
        }
      }
    },
    hashtags: {
      custom: {
        options: (value: string[], { req }) => {
          const type = req.body.type as string
          if (
            (type.toLowerCase() === 'repost' && !Array.isArray(value)) ||
            (type.toLowerCase() === 'repost' && value.length > 0)
          ) {
            throw new ErrorWithStatus({
              status: 400,
              message: 'Hashtags must be a empty array'
            })
          }

          if (Array.isArray(value) && !value.every((item) => typeof item == 'string')) {
            throw new ErrorWithStatus({
              status: 400,
              message: 'Every the item in hashtags array must be a string'
            })
          }
          return true
        }
      }
    },
    mentions: {
      custom: {
        options: async (value: string[], { req }) => {
          const type = req.body.type as string
          if (
            (type.toLowerCase() === 'repost' && !Array.isArray(value)) ||
            (type.toLowerCase() === 'repost' && value.length > 0)
          ) {
            throw new ErrorWithStatus({
              status: 400,
              message: 'Mentions must be a empty array'
            })
          }

          if (!(value.length <= 100)) {
            throw new ErrorWithStatus({
              status: 400,
              message: 'Maximum of mentions is 100'
            })
          }

          const objectIdRegex = /^[0-9a-fA-F]{24}$/
          const validIds = value.filter((user_id) => {
            return !objectIdRegex.test(user_id)
          })
          //return all validIds invalid
          if (validIds.length > 0) {
            throw new ErrorWithStatus({
              status: 404,
              message: `All user_id in array ${validIds} invalid`
            })
          }
          //check user_id match user_id in database

          await Promise.all(
            value.map(async (user_id) => {
              const user = await database.users.findOne({ _id: new ObjectId(user_id) })
              console.log('check 192 ', user)
              if (user == null) {
                throw new ErrorWithStatus({
                  status: 404,
                  message: `User with _id ${user_id} isn't exist`
                })
              }
            })
          )
          return true
        }
      }
    },
    media: {
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as string
          if (
            (type.toLowerCase() === 'repost' && !Array.isArray(value)) ||
            (type.toLowerCase() === 'repost' && value.length > 0)
          ) {
            throw new ErrorWithStatus({
              status: 400,
              message: 'Media must be a empty array'
            })
          }
          const arrTypeMedia = Object.values(IMediaType)
          if (
            value.length > 0 &&
            value?.every((item: any) => {
              return (
                !arrTypeMedia.map((item) => item.toLowerCase()).includes(item.type) || !(typeof item.url === 'string')
              )
            })
          ) {
            throw new ErrorWithStatus({
              status: 400,
              message: 'Media must be an array of media object'
            })
          }
          return true
        }
      }
    }
  },
  ['body']
)

export const postIdValidator = checkSchema(
  {
    post_id: {
      isMongoId: {
        errorMessage: 'invalid post_id'
      },
      custom: {
        options: async (value, { req }) => {
          const post = (
            await database.post
              .aggregate<Post>([
                {
                  $match: {
                    _id: new ObjectId(`${value}`)
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
                    from: 'users',
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
                    },
                    mentions: {
                      password: 0,
                      emailVerifyToken: 0,
                      forgotPasswordToken: 0
                    }
                  }
                }
              ])
              .toArray()
          )[0]
          if (!post) {
            throw new ErrorWithStatus({
              status: 401,
              message: 'Not found the post'
            })
          }
          req.post = post
          return true
        }
      }
    }
  },
  ['body', 'params']
)

export const idPostValidator = checkSchema({
  id_post: {
    custom: {
      options: async (value, { req }) => {
        const typeOfPost = req.body.type
        if (typeOfPost === IPostType.Post.toLowerCase() && !((value === 'null' ? null : value) == null)) {
          throw new ErrorWithStatus({
            status: 400,
            message: '_id of post parent must be a null'
          })
        } else {
          if (typeOfPost !== IPostType.Post.toLowerCase() && !value) {
            throw new ErrorWithStatus({
              status: 400,
              message: "_id of post parent isn't empty"
            })
          }

          if (typeOfPost !== IPostType.Post.toLowerCase() && value) {
            const post = await database.post.findOne({ _id: new ObjectId(value) })
            if (!post) {
              throw new ErrorWithStatus({
                status: 404,
                message: "This is post doesn't exist"
              })
            }
            req.post = post
          }
        }
        return true
      }
    }
  }
})

export const postCircleValidator = wrapAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.user_id
  const post = req.post
  if (post?.audience.toLowerCase() == IPostAudience.PostCircle.toLocaleLowerCase()) {
    if (!req.decoded_access_token) {
      throw new ErrorWithStatus({
        status: 401,
        message: 'Access token is required'
      })
    }
    const author = await database.users.findOne({ _id: post.user_id })
    if (!author || author.status?.toLowerCase() == StatusActivity.Banned.toLocaleLowerCase()) {
      throw new ErrorWithStatus({
        status: 403,
        message: 'This author has been banned'
      })
    }
    const isExistUserInCircle = post.mentions.some((user_id_circle) => user_id_circle.equals(req.user_id))
    if (!author._id.equals(user_id) && !isExistUserInCircle) {
      throw new ErrorWithStatus({
        status: 403,
        message: "The post isn't public"
      })
    }
  }
  next()
})

export const paginationValidator = checkSchema(
  {
    limit: {
      custom: {
        options: (value: number, { req }) => {
          if (!value) {
            throw new ErrorWithStatus({
              status: 400,
              message: "Limit of post isn't empty"
            })
          }
          return true
        }
      }
    },
    page: {
      custom: {
        options: (value: number, { req }) => {
          if (!value) {
            throw new ErrorWithStatus({
              status: 400,
              message: "Page of post isn't empty"
            })
          }
          return true
        }
      }
    }
  },
  ['query']
)
