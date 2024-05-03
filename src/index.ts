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

//connect to Mongodb
database.connect()

// use all routes in here
//users route
app.use('/users', usersRouter)
// sendVerifyRegisterEmail(
//   'faucetpay31415@gmail.com',
//   'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjYzNGE2OGNiZmUyMGY5YWFiMmY5OTQyIiwidG9rZW5fdHlwZSI6IkVtYWlsVmVyaWZ5VG9rZW4iLCJpYXQiOjE3MTQ3MjY1NDAsImV4cCI6MTcxNDczMDE0MH0.FGIBR0Dqb5bq-adHkHtg7CQVPnYSypUkoh9W85lpPB4D6264K51XkK5Y2wAzAS8FPhBTUzqRM3gFFoo_VVfeRSnFv5xaqzPqiaCwji19PBA-5RSHHekz-BuJTxdNYVIc3XojMdL9QA5OLgb7qTMEmjWbyzjDR2jdz8dC_jPjXBBCdm2f_MqoNyasc61L0IPC6yaBZd93p54o1Tqsaj5SaaiLbXY2fFMopflgF4ZKsoqXzGpK6IUgUeWgZfT3MmwBryfsMzgX1ig2eECIifl31LYCjl1IfyLT6braTX-Mp2uS4LzAnRdk8nug5NnKvq4Qupu2KIrq7qMMRLZEOYonow',
//   '6634a68cbfe20f9aab2f9942'
// )

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  //  console.log("check inline 22 ",err instanceof ErrorWithStatus)
  console.log('check 44 ', err)
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json(omit(err, 'status'))
  }
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfor: err
  })
})

app.listen(process.env.PORT, () => {
  console.log(`App iss running on port ${process.env.PORT}`)
})
