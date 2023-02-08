# @brighter/storage

`@brighter/storage` is a JavaScript object storage library that:

- enables local development,
- has a simple, concise API,
- is well documented and tested against real infrastructure.

Why is local development important? Most of today's software talks directly to the cloud, even in local environments. This extends the feedback loop and creates a storage provider dependency.

This library offers a different approach. It introduces a unified storage interface that enables seamless [switching between providers](https://www.cloudflare.com/learning/cloud/what-is-vendor-lock-in/) and a local implementation that [shortens the feedback loop](https://twitter.com/kentbeck/status/531964254946328576) during development.

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
const { Storage } = require('@brighter/storage')

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

- see [examples](examples/README.md),
- track changes in the [changelog](changelog.md) or
- dive straight into the [documentation](docs/README.md).

## Roadmap

- `v1.1.0` Support for relative input paths.
- `v1.1.0` Ensure input paths can't be out of the storage scope.
- `v1.2.0` Azure Blob Storage implementation
- `v1.3.0` Google Storage implementation
