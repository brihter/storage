import { Storage } from '@brighter/storage-adapter-s3'

const BACKBLAZE_BUCKET = 'my-bucket'
const BACKBLAZE_REGION = '...'
const BACKBLAZE_ACCESS_KEY = '...'
const BACKBLAZE_SECRET_ACCESS_KEY = '...'

const storage = Storage({
  path: BACKBLAZE_BUCKET
}, {
  endpoint: `https://${BACKBLAZE_REGION}.your-objectstorage.com/`,
  credentials: {
    accessKeyId: BACKBLAZE_ACCESS_KEY,
    secretAccessKey: BACKBLAZE_SECRET_ACCESS_KEY
  }
})

const main = async () => {
  await storage.write('file', 'hi')
  const msg = await storage.read('file')
  console.log(msg)
}

main().catch(console.error)
