import { Storage as StorageLocal } from '@brighter/storage-adapter-local'
import { Storage as StorageS3 } from '@brighter/storage-adapter-s3'

const createStorage = () => {
  if (process.env.NODE_ENV === 'local') {
    return StorageLocal({ path: '/tmp/storage' })
  } else {
    return StorageS3({ path: 'my-bucket' }, { region: 'eu-central-1' })
  }
}

const main = async () => {
  const storage = createStorage()
  await storage.read('file')
}

main().catch(console.error)
