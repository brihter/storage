# @brighter/storage

`@brighter/storage` is a JavaScript object storage library that:

- enables local development,
- has a simple, concise API and,
- is tested against real infrastructure.

Why is local development important? Most of today's software talks directly to the cloud, even in local environments. This extends the feedback loop and creates a storage provider dependency.

This library offers a different approach. It introduces a unified interface that enables seamless [switching between providers](https://www.cloudflare.com/learning/cloud/what-is-vendor-lock-in/) and a local implementation that [shortens the feedback loop](https://twitter.com/kentbeck/status/531964254946328576) during development.

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

- `v1.0.0-beta.7` Make documentation more verbose.
- `v1.0.0-beta.7` Fix documentation `README.md` index.
- `v1.0.0-beta.8` Rename `uri()` to `url()` and implement `uri()`.
- `v1.0.0` Move out of beta.
- `v2.0.0` Detach the storage client from the library.