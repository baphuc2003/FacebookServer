import bcrypt from 'bcrypt'
const saltRounds = 10

export const hashPassword = (password: string) => {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, decoded) => {
      if (err) {
        reject('Hash password failed!')
      }
      resolve(decoded)
    })
  })
}
