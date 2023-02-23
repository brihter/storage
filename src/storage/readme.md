# @brighter/storage

This is the core object storage library.

Most likely you'll want to use one of the following storage adapters that come pre-bundled with required dependencies:

* [@brighter/storage-adapter-local](../storage-adapter-local/) and
* [@brighter/storage-adapter-s3](../storage-adapter-s3/).

If you wish to manually inject the dependencies, please continue.

## Quick Start

Installation, using npm:

```
npm i @brighter/storage
```

Usage:

```js
import { Storage } from '@brighter/storage'

const storage = Storage({
  type: 'local',
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
