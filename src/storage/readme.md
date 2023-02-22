# @brighter/storage

This is a JavaScript object storage library that:

- enables local development,
- has a simple, concise API,
- is well documented and tested against real infrastructure.

A list of supported object storage providers:

- `local` and
- any `s3` compatible provider (AWS S3, Cloudflare R2, ...).

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
