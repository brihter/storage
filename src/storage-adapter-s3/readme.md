# @brighter/storage-adapter-s3

This is an S3 object storage adapter for the `@brighter/storage` library that comes pre-bundled with all the required S3 dependencies.

## Quick Start

Installation, using npm:

```
npm i @brighter/storage-adapter-s3
```

Usage:

```js
import { Storage } from '@brighter/storage-adapter-s3'

const config = { path: 'my-bucket' }
const configClient = { region: 'eu-central-1' }

const storage = Storage(config, configClient)

const main = async () => {
  await storage.write('msg', 'hi')
  const msg = await storage.read('msg')
  console.log(msg)
}

main().catch(console.error)
```

For more information:

- have a look at the [demo](demo/) folder or
- dive straight into the [documentation](docs/Storage.md).
