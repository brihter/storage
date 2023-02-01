# @brighter/storage

`@brighter/storage` is a JavaScript object storage library that:

- enables local development,
- has a simple, concise API and,
- is tested against real infrastructure.

Why is local development important? Most of today's software talks directly to the cloud, even in local environments. This [extends the feedback loop](https://twitter.com/kentbeck/status/531964254946328576) and creates a [cloud provider dependency](https://www.cloudflare.com/learning/cloud/what-is-vendor-lock-in/).

This library offers a different approach. It introduces a common interface that enables seamless switching between providers and a local implementation that can be used during local development.

A list of supported providers:

- `local` (for local development),
- `s3` (AWS) and
- `r2` (Cloudflare).

## Quick Start

Installation, using npm:

```
npm i @brighter/storage
```

Usage:

```js
const { Storage } = require('@brighter/storage')

const storage = Storage({
  storage: {
    type: 'local',
    path: '/tmp/storage'
  }
})

const main = async () => {
  await storage.write('msg', 'hi')
  const msg = await storage.read('msg')
  console.log(msg)
}

main().catch(console.error)
```

For more information, see the [documentation](documentation.md).

## API

The library aims to provide a simple, concise API that's easy to use and remember. 

Constructors:

- [Storage](documentation.md##constructor)

Properties:

- [config](documentation.md##config)

Methods:

- [copy](documentation.md#copy)
- [exists](#documentation.mdexists)
- [list](#documentation.mdlist)
- [read](#documentation.mdread)
- [remove](#documentation.mdremove)
- [stat](#documentation.mdstat)
- [uri](#documentation.mduri)
- [write](#documentation.mdwrite)

It knows how to handle:

- different content encodings (via `iconv-lite`),
- recursive operations and
- throttling of concurrent operations.

For more information, see the [documentation](documentation.md).