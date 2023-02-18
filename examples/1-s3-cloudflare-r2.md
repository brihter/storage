# Examples

## Prerequisites

```
npm i @aws-sdk/client-s3
npm i @brighter/storage
```

## Example

```js
import S3 from '@aws-sdk/client-s3'
import S3Presign from '@aws-sdk/s3-request-presigner'

import { Storage } from '@brighter/storage'

const config = {
  type: 's3',
  path: 'my-bucket-3d8e8dd/path/to/data'
}

const CF_ACCOUNT_ID = ''
const CF_ACCESS_KEY = ''
const CF_SECRET_ACCESS_KEY = ''

const dependencies = {
  client: S3,
  clientPresign: S3Presign,
  clientInstance: new S3.S3Client({
    region: 'auto',
    endpoint: `https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: CF_ACCESS_KEY,
      secretAccessKey: CF_SECRET_ACCESS_KEY
    }
  })
}

const storage = Storage(config, dependencies)
```
