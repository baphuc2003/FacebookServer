import fs, { unlinkSync } from 'fs'
import path from 'path'
import { Request, Response } from 'express'
import formidable from 'formidable'
import { ErrorWithStatus } from '~/models/Errors'

export function initFolderUploadImage() {
  const uploadPath = [
    path.resolve('uploads/images'),
    path.resolve('uploads/videos'),
    path.resolve('uploads/images/temp'),
    path.resolve('uploads/videos/temp')
  ]
  uploadPath.forEach((path) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true })
    }
  })
}

export async function handleUploadMultipleImage(req: Request, res: Response) {
  const formidable = (await import('formidable')).default
  const pathImages = path.resolve('uploads/images/temp')

  const form = formidable({
    uploadDir: pathImages,
    keepExtensions: true, // Giữ lại phần mở rộng của tệp
    maxFileSize: 2 * 1024 * 1024, // Giới hạn kích thước tệp là 2MB,
    filter: ({
      name,
      originalFilename,
      mimetype
    }: {
      name: string | null
      originalFilename: string | null
      mimetype: string | null
    }) => {
      // keep only images
      if (
        (mimetype && mimetype === 'image/jpeg') ||
        mimetype === 'image/png' ||
        mimetype === 'image/jpg' ||
        mimetype === 'image/gif'
      ) {
        return true
      }

      return true
    }
  })

  return new Promise<formidable.File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      const inforImage: formidable.File[] | undefined = files['multiple-image']
      //check exist of file image
      if (!inforImage) {
        return res.status(400).json({
          message: "File image isn't empty"
        })
      }
      const arrInforImage = inforImage?.map((item) => JSON.parse(JSON.stringify(item)))

      //check maximum number of file image
      if (arrInforImage.length > 4) {
        arrInforImage.forEach((item) => {
          unlinkSync(item.filepath)
        })
        return res.status(400).json({
          message: 'Maximum number of file allowed 4'
        })
      }

      //check extensions of images
      if (arrInforImage !== undefined) {
        const validExtensions = ['.jpeg', '.png', '.jpg', '.gif']
        let isErr = false
        arrInforImage.forEach((item) => {
          const ext = path.extname(item.originalFilename)
          if (!validExtensions.includes(ext)) {
            isErr = true
          }
        })
        if (isErr) {
          arrInforImage.forEach((item) => {
            unlinkSync(item.filepath)
          })
          return res.status(400).json({
            message: 'Type of image invalid'
          })
        }
      }

      if (err) {
        return res.status(400).json({
          message: 'Error uploading file',
          error: err.message
        })
      }

      return resolve(arrInforImage as formidable.File[])
    })
  })
}

export async function handleUploadSingleImage(req: Request, res: Response) {
  const formidable = (await import('formidable')).default
  const pathImages = path.resolve('uploads/images/temp')

  const form = formidable({
    uploadDir: pathImages,
    keepExtensions: true, // Giữ lại phần mở rộng của tệp
    maxFileSize: 2 * 1024 * 1024, // Giới hạn kích thước tệp là 2MB,
    filter: ({
      name,
      originalFilename,
      mimetype
    }: {
      name: string | null
      originalFilename: string | null
      mimetype: string | null
    }) => {
      // keep only images
      if (
        (mimetype && mimetype === 'image/jpeg') ||
        mimetype === 'image/png' ||
        mimetype === 'image/jpg' ||
        mimetype === 'image/gif'
      ) {
        return true
      }

      return true
    }
  })

  return new Promise<formidable.File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      const inforImage: formidable.File[] | undefined = files['single-image']
      //check exist of file image
      if (!inforImage) {
        return res.status(400).json({
          message: "File image isn't empty"
        })
      }
      const arrInforImage = inforImage?.map((item) => JSON.parse(JSON.stringify(item)))

      //check maximum number of file image
      if (arrInforImage.length > 1) {
        arrInforImage.forEach((item) => {
          unlinkSync(item.filepath)
        })
        return res.status(400).json({
          message: 'Maximum number of file allowed 1'
        })
      }

      //check extensions of images
      if (arrInforImage !== undefined) {
        const validExtensions = ['.jpeg', '.png', '.jpg', '.gif']
        let isErr = false
        arrInforImage.forEach((item) => {
          const ext = path.extname(item.originalFilename)
          if (!validExtensions.includes(ext)) {
            isErr = true
          }
        })
        if (isErr) {
          arrInforImage.forEach((item) => {
            unlinkSync(item.filepath)
          })
          return res.status(400).json({
            message: 'Type of image invalid'
          })
        }
      }

      if (err) {
        return res.status(400).json({
          message: 'Error uploading file',
          error: err.message
        })
      }

      return resolve(arrInforImage as formidable.File[])
    })
  })
}

export async function handleUploadVideo(req: Request, res: Response) {
  const formidable = (await import('formidable')).default
  const nanoid = (await import('nanoid')).nanoid
  const idName = nanoid()
  fs.mkdirSync(path.resolve('uploads/videos', idName))
  const pathVideos = path.resolve('uploads/videos/temp')

  const form = formidable({
    uploadDir: pathVideos,
    // keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024 * 1024, // Giới hạn kích thước tệp là 50MB,
    filter: ({
      name,
      originalFilename,
      mimetype
    }: {
      name: string | null
      originalFilename: string | null
      mimetype: string | null
    }) => {
      // keep only images
      return true
    },
    filename: function () {
      return idName
    }
  })

  return new Promise<formidable.File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      const inforVideo: formidable.File[] | undefined = files['video']
      //check exist of file image
      if (!inforVideo) {
        return res.status(400).json({
          message: "File image isn't empty"
        })
      }
      const arrInforImage = inforVideo?.map((item) => JSON.parse(JSON.stringify(item)))

      //check maximum number of file image
      if (arrInforImage.length > 1) {
        arrInforImage.forEach((item) => {
          unlinkSync(item.filepath)
        })
        return res.status(400).json({
          message: 'Maximum number of file allowed 1'
        })
      }

      //check extensions of images
      if (arrInforImage !== undefined) {
        const validExtensions = ['.mp4']
        let isErr = false
        arrInforImage.forEach((item) => {
          const ext = path.extname(item.originalFilename)
          if (!validExtensions.includes(ext)) {
            isErr = true
          } else {
            //remove file from folder videos/temp to folder videos
            fs.renameSync(item.filepath, path.resolve(`uploads/videos/${idName}`, `${item.newFilename}.mp4`))
          }
        })
        if (isErr) {
          arrInforImage.forEach((item) => {
            unlinkSync(item.filepath)
          })
          return res.status(400).json({
            message: 'Type of video invalid'
          })
        }
      }

      if (err) {
        return res.status(400).json({
          message: 'Error uploading file',
          error: err.message
        })
      }

      return resolve(arrInforImage as formidable.File[])
    })
  })
}
