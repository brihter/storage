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

- have a look at the [demo](src/storage/demo/) folder or
- dive straight into the [documentation](src/storage/docs/Storage.md).

## Why

Why is local development important? Most of today's software talks directly to the cloud, even in local environments. This extends the feedback loop and creates a storage provider dependency.

This library offers a different approach. It introduces a unified storage interface that enables seamless [switching between providers](https://www.cloudflare.com/learning/cloud/what-is-vendor-lock-in/) and a local implementation that [shortens the feedback loop](https://twitter.com/kentbeck/status/531964254946328576) and increases [velocity](https://arc.codes/docs/en/guides/developer-experience/local-development) during development.

## Roadmap

- `v2.0.0` Azure Blob Storage implementation.
- `v3.0.0` Google Storage implementation.

## Testing

```
npm run test                      # run tests
npm run test -- --provider=local  # run tests for a specific provider
```

## Releasing

```
npm run release             # set version by bumping the patch number, tag the commit
npm run release -- 1.0.0    # set specific version, tag the commit
```
