# Examples

## Prerequisites

```
npm i @aws-sdk/client-s3
npm i @brighter/storage
```

## Example

```js
const S3 = require('@aws-sdk/client-s3')
const { Storage } = require('@brighter/storage')

const config = {
  type: 's3',
  path: 'my-bucket-3d8e8dd/path/to/data'
}

const CF_ACCOUNT_ID = ''
const CF_ACCESS_KEY = ''
const CF_SECRET_ACCESS_KEY = ''

const dependencies = {
  client: S3,
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
