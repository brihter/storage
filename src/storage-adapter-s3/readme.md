# @brighter/storage-adapter-s3

This is a storage adapter for `@brighter/storage` that comes bundled with required S3 dependencies.

For more information:

- see the [demo](demo/) folder or
- dive straight into the [documentation](docs/Storage.md).

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
