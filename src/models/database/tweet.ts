import { ObjectId } from 'mongodb'

enum IPostType {
  Post = 'Post',
  Retpost = 'Repost',
  QoutePost = 'QoutePost',
  Comment = 'Comment'
}

enum IPostAudience {
  Everyone = 'Everyone',
  PostCircle = 'PostCircle'
}

enum IMediaType {
  Image = 'Image',
  Video = 'Video'
}

interface IMedia {
  url: string
  type: IMediaType
}

export interface IRequestBodyTweet {
  type: IPostType
  audience: IPostAudience
  content: string
  parent_id: null | string
  hashtags: string[] //luu duoi dang ['phuc','phuc sim lo']
  mentions: string[] //luu duoi dang nhu user_id[]
  media: IMedia[]
}

interface IPost {
  _id?: ObjectId
  user_id?: ObjectId
  type: IPostType
  audience: IPostAudience
  content: string
  parent_id: null | string
  hashtags: string[] //luu duoi dang ['phuc','phuc sim lo']
  mentions: string[] //luu duoi dang nhu user_id[]
  media: IMedia[]
  guest_view?: number
  user_view?: number
  created_at?: Date
  updated_at?: Date
}

export class Post {
  _id?: ObjectId
  user_id?: ObjectId
  type: IPostType
  audience: IPostAudience
  content: string
  parent_id: null | string
  hashtags: string[]
  mentions: string[]
  media: IMedia[]
  guest_view?: number
  user_view?: number
  created_at?: Date
  updated_at?: Date

  constructor(post: IPost) {
    this._id = post._id
    this.user_id = post.user_id
    this.type = post.type
    this.audience = post.audience
    this.content = post.content
    this.parent_id = post.parent_id
    this.hashtags = post.hashtags
    this.mentions = post.mentions
    this.media = post.media
    this.guest_view = post.guest_view
    this.user_view = post.user_view
    this.created_at = post.created_at
    this.updated_at = post.updated_at
  }
}
