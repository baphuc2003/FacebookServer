import e, { Request, Response, NextFunction } from 'express'
import formidable from 'formidable'
import { unlinkSync } from 'fs'
import path from 'path'
import mediaService from '~/services/media.services'
import fs from 'fs'

export const uploadMutipleImageController = async (req: Request, res: Response) => {
  const result = await mediaService.handleUploadMultipleImage(req, res)
  return res.status(200).json({
    message: 'Upload image successfully',
    result
  })
}

export const uploadSingleImageController = async (req: Request, res: Response) => {
  const result = await mediaService.handleUploadSingleImage(req, res)
  return res.status(200).json({
    message: 'Upload image successfully',
    result
  })
}

export const uploadVideoController = async (req: Request, res: Response) => {
  const result = await mediaService.handleUploadVideo(req, res)
  return res.status(200).json({
    message: 'Upload video successfully',
    result
  })
}

export const uploadVideoHLSController = async (req: Request, res: Response) => {
  const result = await mediaService.handleUploadVideoHLS(req, res)
  return res.status(200).json({
    message: 'Upload video successfully',
    result
  })
}

export const serverImageController = async (req: Request, res: Response) => {
  const { name } = req.params
  return res.sendFile(path.resolve('uploads/images', name), (err) => {
    if (err) {
      return res.status((err as any).status).send('Not found')
    }
  })
}

export const serverVideoController = async (req: Request, res: Response) => {
  const { name } = req.params
  const range = req.headers.range
  const mime = (await import('mime')).default
  if (!range) {
    return res.status(400).json({
      message: 'Required range header'
    })
  }
  const videoPath = path.resolve('uploads/videos', name)

  //Dung lượng video(bytes)
  const videoSize = fs.statSync(videoPath).size
  //Dung lượng video cho mỗi phân đoạn stream (vd 1Mb)
  const chunkSize = 10 ** 6
  //Lấy giá trị byte bắt đầu từ header range (vd byte = 1048567-)
  const start = Number(range.replace(/\D/g, ''))
  //Lấy giá trị byte kết thúc, vượt quá dung lượng thì lấy giá trị cuối cùng
  const end = Math.min(start + chunkSize, videoSize - 1)
  //Dung lượng thực tế cho mỗi đoạn video stream
  //Thường đây là chunkSize, ngoại trừ đoạn cuối.
  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*'
  const headers = {
    'Content-Range': `bytes ${start} - ${end} / ${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(206, headers)
  const videoStream = fs.createReadStream(videoPath, { start, end })
  videoStream.pipe(res)
  // return res.sendFile(path.resolve('uploads/videos', name))
}

export const serverVideoM3U8Controller = async (req: Request, res: Response) => {
  const { id } = req.params
  console
  return res.sendFile(path.resolve(`uploads/videos`, id, 'master.m3u8'))
}

export const serverVideoSegmentController = async (req: Request, res: Response) => {
  const { id, v, segment } = req.params
  return res.sendFile(path.resolve(`uploads/videos`, id, v, segment))
}
