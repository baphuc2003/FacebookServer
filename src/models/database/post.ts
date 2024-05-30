import { ObjectId } from 'mongodb'

export enum IPostType {
  Post = 'Post',
  Retpost = 'Repost',
  QoutePost = 'QoutePost',
  Comment = 'Comment'
}

export enum IPostAudience {
  Everyone = 'Everyone',
  PostCircle = 'PostCircle'
}

export enum IMediaType {
  Image = 'Image',
  Video = 'Video'
}

interface IMedia {
  url: string
  type: IMediaType
}

export interface IRequestBodyPost {
  user_id: ObjectId
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
  hashtags: ObjectId[] | [] //luu duoi dang ['phuc','phuc sim lo']
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
  parent_id: null | ObjectId
  hashtags: ObjectId[] | []
  mentions: ObjectId[]
  media: IMedia[]
  guest_view?: number
  user_view?: number
  created_at?: Date
  updated_at?: Date

  constructor(post: IPost) {
    const date = new Date()
    this._id = post._id || new ObjectId()
    this.user_id = post.user_id
    this.type = post.type
    this.audience = post.audience
    this.content = post.content
    this.parent_id = post.parent_id ? new ObjectId(post.parent_id) : null
    this.hashtags = post.hashtags || []
    this.mentions = post.mentions.map((mention) => new ObjectId(mention))
    this.media = post.media
    this.guest_view = post.guest_view || 0
    this.user_view = post.user_view || 0
    this.created_at = post.created_at || date
    this.updated_at = post.updated_at || date
  }
}
