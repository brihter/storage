import { Storage } from '@brighter/storage-adapter-s3'

const HETZNER_BUCKET = 'my-bucket'
const HETZNER_REGION = 'fsn1'
const HETZNER_ACCESS_KEY = '...'
const HETZNER_SECRET_ACCESS_KEY = '...'

const storage = Storage({
  path: HETZNER_BUCKET
}, {
  endpoint: `https://${HETZNER_REGION}.your-objectstorage.com/`,
  credentials: {
    accessKeyId: HETZNER_ACCESS_KEY,
    secretAccessKey: HETZNER_SECRET_ACCESS_KEY
  }
})

const main = async () => {
  await storage.write('info.log', 'hi')
  const msg = await storage.read('info.log')
  console.log(msg)
}

main().catch(console.error)
