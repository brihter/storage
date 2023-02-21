// TODO fix tests
// TODO create index.d.ts
// TODO generate docs
// TODO improve readme

import S3 from '@aws-sdk/client-s3'
import S3Presign from '@aws-sdk/s3-request-presigner'

import { Storage } from '@brighter/storage'

const createStorage = (config, clientConfig) => {
  return Storage(
    {
      ...config,
      type: 's3'
    },
    {
      client: S3,
      clientPresign: S3Presign,
      clientInstance: new S3.S3Client(clientConfig)
    }
  )
}

export { createStorage }
