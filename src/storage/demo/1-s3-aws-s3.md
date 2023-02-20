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

const dependencies = {
  client: S3,
  clientPresign: S3Presign,
  clientInstance: new S3.S3Client({ region: 'eu-central-1' })
}

const storage = Storage(config, dependencies)
```
