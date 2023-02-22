import { Storage } from '@brighter/storage-adapter-s3'

const storageConfig = {
  path: 'my-bucket'
}

const storageProviderConfig = {
  region: 'eu-central-1'
}

const main = async () => {
  const storage = Storage(storageConfig, storageProviderConfig)
  await storage.write('msg', 'hi')
  const msg = await storage.read('msg')
  console.log(msg)
}

main().catch(console.error)
