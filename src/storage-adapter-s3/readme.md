# @brighter/storage-adapter-s3

`@brighter/storage-adapter-s3` is a storage adapter that comes prebundled with required S3 dependencies.

## Quick Start

Installation, using npm:

```
npm i @brighter/storage-adapter-s3
```

Usage:

```js
import { Storage } from '@brighter/storage-adapter-s3'

const config = {
  path: 'my-bucket'
}

const clientConfig = {
  region: 'eu-central-1'
}

const main = async () => {
  const storage = Storage(config, clientConfig)
  await storage.write('msg', 'hi')
  const msg = await storage.read('msg')
  console.log(msg)
}

main().catch(console.error)
```
