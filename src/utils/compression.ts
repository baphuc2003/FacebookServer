// utils/compression.ts
import { gzip, ungzip } from 'node-gzip'

// Hàm nén dữ liệu
export const compressData = async (data: string): Promise<Buffer> => {
  return await gzip(data)
}

// Hàm giải nén dữ liệu
export const decompressData = async (data: Buffer): Promise<string> => {
  return (await ungzip(data)).toString()
}
