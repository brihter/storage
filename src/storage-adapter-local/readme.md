# @brighter/storage-adapter-local

This is the local adapter for `@brighter/storage` object storage library.

## Quick Start

Installation, using npm:

```
npm i @brighter/storage-adapter-local
```

Usage:

```js
import { Storage } from '@brighter/storage-adapter-local'

const config = {
  path: 'my-bucket'
}

const main = async () => {
  const storage = Storage(config)
  await storage.write('msg', 'hi')
  const msg = await storage.read('msg')
  console.log(msg)
}

main().catch(console.error)
```

For more information:

- have a look at the [demo](demo/) folder or
- dive straight into the [documentation](docs/Storage.md).
