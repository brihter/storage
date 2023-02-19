# @brighter/storage-adapter-s3

`@brighter/storage-adapter-s3` is a `@brighter/storage` adapter that comes prebundled with required S3 dependencies.

## Quick Start

Installation, using npm:

```
npm i @brighter/storage-adapter-s3
```

Usage:

```js
import { createStorage } from '@brighter/storage-adapter-s3'

const storage = createStorage({
  path: 'my-bucket'
}, {
  region: 'eu-central-1'
})

const main = async () => {
  await storage.write('msg', 'hi')
  const msg = await storage.read('msg')
  console.log(msg)
}

main().catch(console.error)
```
