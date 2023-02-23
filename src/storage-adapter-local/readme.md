# @brighter/storage-adapter-local

This is a local object storage adapter for the `@brighter/storage` library.

## Quick Start

Installation, using npm:

```
npm i @brighter/storage-adapter-local
```

Usage:

```js
import { Storage } from '@brighter/storage-adapter-local'

const storage = Storage({
  path: '/tmp/storage'
})

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
