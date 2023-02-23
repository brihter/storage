import S3 from '@aws-sdk/client-s3'
import S3Presign from '@aws-sdk/s3-request-presigner'

import { Storage as StorageCore } from '@brighter/storage'

const Storage = (config, configClient) => {
  return StorageCore(
    {
      ...config,
      type: 's3'
    },
    {
      client: S3,
      clientPresign: S3Presign,
      clientInstance: new S3.S3Client(configClient)
    }
  )
}

export { Storage }
