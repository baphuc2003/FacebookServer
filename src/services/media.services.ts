import { handleUploadMultipleImage, handleUploadSingleImage, handleUploadVideo } from '~/utils/media'
import { Request, Response } from 'express'
import sharp from 'sharp'
import path from 'path'
import { unlinkSync } from 'fs'
import { uploadFileToS3 } from '~/utils/s3_upload'
import fs from 'fs'
import { MediaType } from '~/constants/enum'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'

class MediaServices {
  async handleUploadMultipleImage(req: Request, res: Response) {
    const file = await handleUploadMultipleImage(req, res)
    // const newFilePath = path.resolve('uploads/images')
    const processingPromise = file.map(async (file) => {
      const name = file.newFilename.split('.')[0]
      const outputPath = path.resolve('uploads/images', `${name}.jpg`)
      await sharp(file.filepath).jpeg().toFile(outputPath)
      //delete image in folder temp
      unlinkSync(path.resolve(`uploads/images/temp`, `${file.newFilename}`))
      //get file image to S3 amazaon
      const result = await uploadFileToS3({
        key: `demo4/${name}.jpg`,
        body: outputPath
      })
      unlinkSync(path.resolve('uploads/images', `${name}.jpg`))
      return result
    })
    return await Promise.all(processingPromise)
  }

  async handleUploadSingleImage(req: Request, res: Response) {
    const file = await handleUploadSingleImage(req, res)
    // const newFilePath = path.resolve('uploads/images')
    const processingPromise = file.map(async (file) => {
      const name = file.newFilename.split('.')[0]
      const outputPath = path.resolve('uploads/images', `${name}.jpg`)
      await sharp(file.filepath).jpeg().toFile(outputPath)
      //delete image in folder temp
      unlinkSync(path.resolve(`uploads/images/temp`, `${file.newFilename}`))
      //get file image to S3 amazaon
      const result = await uploadFileToS3({
        key: `demo3/${name}.jpg`,
        body: outputPath
      })
      unlinkSync(path.resolve('uploads/images', `${name}.jpg`))
      return result
    })
    return await Promise.all(processingPromise)
  }

  async handleUploadVideo(req: Request, res: Response) {
    const file = await handleUploadVideo(req, res)
    console.log('check 54 ', file)
    const newFileName = file[0].newFilename
    return {
      url: `http://localhost:4000/uploads/videos/temp/${newFileName}`,
      type: MediaType.Video
    }
  }

  async handleUploadVideoHLS(req: Request, res: Response) {
    const file = await handleUploadVideo(req, res)
    const result = await Promise.all(
      file.map(async (file) => {
        await encodeHLSWithMultipleVideoStreams(
          path.resolve(`uploads/videos/${file.newFilename}`, `${file.newFilename}.mp4`)
        )
        fs.unlinkSync(path.resolve(`uploads/videos/${file.newFilename}`, `${file.newFilename}.mp4`))
      })
    )
    const newFileName = file[0].newFilename
    return {
      url: `http://localhost:4000/static/video-hls/${newFileName}`,
      type: MediaType.Video
    }
  }
}

const mediaService = new MediaServices()
export default mediaService
