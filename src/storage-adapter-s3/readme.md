# @brighter/storage-adapter-s3

This is an adapter for `@brighter/storage` object storage library that comes pre-bundled with all the required S3 dependencies.

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

For more information:

- see the [demo](demo/) folder or
- dive straight into the [documentation](docs/Storage.md).
