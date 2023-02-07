# @brighter/storage

`@brighter/storage` is a JavaScript object storage library that:

- enables local development,
- has a simple, concise API,
- is well documented and tested against real infrastructure.

Why is local development important? Most of today's software talks directly to the cloud, even in local environments. This extends the feedback loop and creates a storage provider dependency.

This library offers a different approach. It introduces a unified storage interface that enables seamless [switching between providers](https://www.cloudflare.com/learning/cloud/what-is-vendor-lock-in/) and a local implementation that [shortens the feedback loop](https://twitter.com/kentbeck/status/531964254946328576) during development.

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

For more information, see the [documentation](docs/README.md).

## Roadmap

- `v1.0.0-beta.9` Rename `uri()` to `url()` and implement `uri()`.
- `v1.0.0-beta.10` Add examples.
- `v1.0.0-beta.10` Add example links to the README.
- `v1.0.0-beta.10` Add the CHANGELOG link to the README.
- `v1.0.0` Move out of beta.
- `v1.1.0` Support for relative input paths.
- `v1.1.0` Ensure input paths can't be out of the storage scope.
- `v2.0.0` Detach the storage client from the library.
- `v2.1.0` Azure Blob Storage implementation
- `v2.2.0` Google Storage implementation
