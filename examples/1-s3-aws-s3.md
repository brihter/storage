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

const dependencies = {
  client: S3,
  clientInstance: new S3.S3Client({ region: 'eu-central-1' })
}

const storage = Storage(config, dependencies)
```
