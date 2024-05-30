import { Router } from 'express'
import {
  serverImageController,
  serverVideoController,
  serverVideoM3U8Controller,
  serverVideoSegmentController
} from '~/controllers/media.controllers'
import { wrapAsync } from '~/utils/handlers'

const staticRouter = Router()

staticRouter.get('/image/:name', wrapAsync(serverImageController))

staticRouter.get('/video/:name', wrapAsync(serverVideoController))

staticRouter.get('/video-hls/:id/master.m3u8', wrapAsync(serverVideoM3U8Controller))

staticRouter.get('/video-hls/:id/:v/:segment', wrapAsync(serverVideoSegmentController))

export default staticRouter
