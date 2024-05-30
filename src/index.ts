import usersRouter from './routes/users.routes'
import { Database } from './services/database.services'
import express from 'express'
import 'dotenv/config'
import { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import database from './services/database.services'
import { ErrorWithStatus } from './models/Errors'
import { httpStatus } from './constants/httpStatus'
import { omit } from 'lodash'
import { sendVerifyRegisterEmail } from './utils/email'
import cors from 'cors'
import session from 'express-session'
import postRouter from './routes/post.routes'
import { IPostType } from './models/database/post'
import bookmarkRouter from './routes/bookmark.routes'
import likeRouter from './routes/like.routes'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import { Conversation } from './models/database/conversation'
import { compressData } from './utils/compression'
import conversationRouter from './routes/conversation.routes'
import { ObjectId } from 'mongodb'
import mediaRouter from './routes/media.routes'
import path from 'path'
import { initFolderUploadImage } from './utils/media'
import './utils/s3_upload'
import staticRouter from './routes/static.routes'

const app = express()
const httpServer = createServer(app)

//init folder uploads/images
initFolderUploadImage()

//user cors
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'user_id'],
    credentials: true
  })
)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(cookieParser())

//connect to Mongodb
// database.connect()
// console.log('check 50 ', __dirname)
// console.log('check 51 ', path.resolve('uploads/images'))

// use all routes in here
//users route
app.use('/users', usersRouter)
//tweet route
app.use('/post', postRouter)
//bookmark route
app.use('/bookmark', bookmarkRouter)
//like route
app.use('/like', likeRouter)
//conversation route
app.use('/conversation', conversationRouter)
//media route
app.use('/media', mediaRouter)
app.use('/static', staticRouter)

// app.use('/static', express.static(path.resolve('uploads')))
// app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json(omit(err, 'status'))
  }
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfor: err
  })
})

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
})
const objUsers: {
  [key: string]: {
    socket_id: string
  }
} = {}
io.on('connection', (socket) => {
  const user_id = socket.handshake.auth._id

  objUsers[user_id] = {
    socket_id: socket.id
  }
  socket.on('private_message', async (data) => {
    //save data in database
    const x = await compressData(data.content)
    if (data.content.trim() !== '' && data.from !== null && data.to !== null && data.from !== data.to) {
      await database.conversation.insertOne(
        new Conversation({
          sender_id: new ObjectId(data.from),
          receiver_id: new ObjectId(data.to),
          // content: await compressData(data.content)
          content: data.content
        })
      )
    }

    const receive_user_id = objUsers[data.to]?.socket_id
    if (receive_user_id) {
      socket.to(receive_user_id).emit('receive_private_message', {
        content: data.content,
        from: data.from,
        time: new Date()
      })
    } else {
      console.log('User not found or not connected')
    }
  })

  socket.on('disconnect', () => {
    delete objUsers[user_id]
  })
})

httpServer.listen(process.env.PORT, () => {
  console.log(`App iss running on port ${process.env.PORT}`)
})
