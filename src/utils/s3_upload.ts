import { S3, S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import fs from 'fs'
// Create S3 service object
const s3 = new S3({
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: 'AKIA6LZIFTJ25Y2CNIRE',
    secretAccessKey: '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'
  }
})

// s3.listBuckets({}).then((data) => console.log(data))

export async function uploadFileToS3({
  bucket = 'socialnetworksalaza',
  key,
  body
}: {
  bucket?: string
  key: string
  body: string
}) {
  try {
    const ext = key.split('.')[1].toLowerCase() === 'jpg' ? 'image/jpeg' : 'video/mp4'
    const file = fs.readFileSync(body)
    const parallelUploads3 = new Upload({
      client: new S3({}) || new S3Client({}),
      params: { Bucket: bucket, Key: key, Body: file, ContentType: ext },
      // optional tags
      tags: [
        /*...*/
      ],
      // additional optional fields show default values below:
      // (optional) concurrency configuration
      queueSize: 4,
      // (optional) size of each part, in bytes, at least 5MB
      partSize: 1024 * 1024 * 5,
      // (optional) when true, do not automatically call AbortMultipartUpload when
      // a multipart upload fails to complete. You should then manually handle
      // the leftover parts.
      leavePartsOnError: false
    })

    parallelUploads3.on('httpUploadProgress', (progress) => {
      // console.log(progress)
    })

    return await parallelUploads3.done().then((data) => data.Location)
  } catch (e) {
    console.log(e)
  }
}
