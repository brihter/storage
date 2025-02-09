# @brighter/storage

A cloud agnostic JavaScript object storage library that's built with simplicity and local development in mind.

It offers:

- a unified [storage interface](src/storage/docs/StorageInterface.md) (for seamless switching between providers),
- a [local storage provider](src/storage-adapter-local/readme.md) implementation (enabling local development),
- an [S3 compatible storage provider](src/storage-adapter-s3/readme.md) (supporting AWS S3, Cloudflare R2, ...),
- a simple, concise [API](src/storage/docs/StorageInterface.md) that's tested against real infrastructure and
- comprehensive [documentation](src/storage/docs/Storage.md).

## Why

Most of today's software talks directly to the cloud, even in local environments. This [extends the feedback loop](https://twitter.com/kentbeck/status/531964254946328576) and creates a [storage provider dependency](https://www.cloudflare.com/learning/cloud/what-is-vendor-lock-in/).

This library takes a different approach.

It introduces a unified storage interface that enables seamless switching between providers and a local storage provider implementation that shortens the feedback loop and maximizes velocity during development.

It's API is easy to use and remember. It removes away the complexity of manually passing around continuation tokens, promise throttling, dealing with various different content encodings and presigning requests.

## Quick Start

Instead of manually installing and injecting the dependencies, you'll most likely want to use one of the following storage adapters that come pre-bundled with everything required:

* [@brighter/storage-adapter-local](src/storage-adapter-local/) and
* [@brighter/storage-adapter-s3](src/storage-adapter-s3/) (AWS S3, Cloudflare R2, DigitalOcean Spaces, ...).

*Note: Before installing, Node.js 16 or higher is required.*

Installation, using npm:

```bash
npm i @brighter/storage-adapter-local
npm i @brighter/storage-adapter-s3
```

Usage:

```js
import { Storage } from '@brighter/storage-adapter-s3'

const storage = Storage({ path: 'my-bucket' }, { region: 'eu-central-1' })

const main = async () => {
  await storage.write('info.log', 'hello')
  const msg = await storage.read('info.log')
  console.log(msg)
}

main().catch(console.error)
```

For more information:

- have a look at the [demo](demo/) folder or
- dive straight into the [documentation](src/storage/docs/Storage.md).

## API

Here's a quick API overview:

```js
const main = async (storage) => {
  await storage.read('info.log')
  await storage.write('info.log', 'hello')
  await storage.exists('info.log')
  await storage.stat('info.log')
  await storage.remove('info.log')
  await storage.copy('info.log', 'info.copy.log')
  await storage.list('/')
  await storage.presign('info.log')
}
```

See [StorageInterface](src/storage/docs/StorageInterface.md) for more information.

## Local Development

Storage can be created so that the code automatically switches between the providers depending on the environment. This way, during local development, the local provider is used as it speeds up the feedback loop.

```js
import { Storage as StorageLocal } from '@brighter/storage-adapter-local'
import { Storage as StorageS3 } from '@brighter/storage-adapter-s3'

const createStorage = () => {
  if (process.env.NODE_ENV === 'local') {
    return StorageLocal({ path: '/tmp/storage' })
  } else {
    return StorageS3({ path: 'my-bucket' }, { region: 'eu-central-1' })
  }
}

const main = async () => {
  const storage = createStorage()
  await storage.read('info.log')
}

main().catch(console.error)
```

## Compatibility

The library is actively tested against the following Node.js versions:

- 16.x
- 18.x
- 20.x
- 22.x

The library is actively tested against the following cloud object storage providers:

- AWS S3
- Cloudflare R2

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
