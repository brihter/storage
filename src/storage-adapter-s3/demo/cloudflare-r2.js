import { Storage } from '@brighter/storage-adapter-s3'

const CF_ACCOUNT_ID = ''
const CF_ACCESS_KEY = ''
const CF_SECRET_ACCESS_KEY = ''

const storageConfig = {
  path: 'my-bucket'
}

const storageProviderConfig = {
  region: 'auto',
  endpoint: `https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: CF_ACCESS_KEY,
    secretAccessKey: CF_SECRET_ACCESS_KEY
  }
}

const main = async () => {
  const storage = Storage(storageConfig, storageProviderConfig)
  await storage.write('msg', 'hi')
  const msg = await storage.read('msg')
  console.log(msg)
}

main().catch(console.error)
