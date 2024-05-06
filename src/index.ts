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

const app = express()

//user cors
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//use session
// Sử dụng session middleware
app.use(
  session({
    secret: 's32783yxdunu8gx7yyg8x',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  })
)

//connect to Mongodb
database.connect()

// use all routes in here
//users route
app.use('/users', usersRouter)
//tweet route
app.use('/post', postRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  //  console.log("check inline 22 ",err instanceof ErrorWithStatus)
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json(omit(err, 'status'))
  }
  // Object.getOwnPropertyNames(err).forEach((key) => {
  //   Object.defineProperty(err, key, { enumerable: true })
  // })
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfor: err
  })
})

app.listen(process.env.PORT, () => {
  console.log(`App iss running on port ${process.env.PORT}`)
})
