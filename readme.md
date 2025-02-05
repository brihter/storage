# @brighter/storage

A cloud agnostic JavaScript object storage library that's built with simplicity and local development in mind.

It offers:

- a unified storage interface (for seamless switching between providers),
- a [local storage provider](src/storage-adapter-local/readme.md) implementation (enabling local development),
- a simple, concise [API](src/storage/docs/StorageInterface.md) that's tested against real infrastructure and
- comprehensive [documentation](src/storage/docs/Storage.md).

## Why

Most of today's software talks directly to the cloud, even in local environments. This [extends the feedback loop](https://twitter.com/kentbeck/status/531964254946328576) and creates a [storage provider dependency](https://www.cloudflare.com/learning/cloud/what-is-vendor-lock-in/).

This library takes a different approach.

It introduces a unified storage interface that enables seamless switching between providers and a local storage provider implementation that shortens the feedback loop and maximizes velocity during development.

It's API is easy to use and remember. It removes away the complexity of manually passing around continuation tokens, promise throttling, dealing with various different content encodings and presigning requests.

## Overview

Here's a short API overview:

```js
import { Storage } from '@brighter/storage'

const storage = Storage({
  type: 'local',
  path: '/tmp/storage'
})

await storage.read('file')
await storage.read('file', { encoding: 'ascii' })
// ...

await storage.write('file', 'hello')
await storage.write('file', 'Ω', { encoding: 'utf8' })
// ...

await storage.remove('file')
await storage.remove('dir/', { recursive: true })
// ...

await storage.stat('file')
// ...

await storage.copy('file', 'file_copy')
await storage.copy('dir/', 'dir_copy/', { concurrency: 10 })
// ...

await storage.list('/')
await storage.list('/', { recursive: true })
// ...

await storage.exists('file')
await storage.exists('dir/')
// ...

await storage.presign('file')
await storage.presign('file', { expiresIn: 3600 })
// ...
```

See [StorageInterface]((src/storage/docs/StorageInterface.md)) for more information.

## Quick Start

Installation, using npm:

```bash
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

## The Not So Quick Start

Instead of manually installing and injecting the dependencies, you'll most likely want to use one of the following storage adapters that come pre-bundled with everything required:

* [@brighter/storage-adapter-local](src/storage-adapter-local/) and
* [@brighter/storage-adapter-s3](src/storage-adapter-s3/) (AWS S3, Cloudflare R2, DigitalOcean Spaces, ...).

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
  await storage.write('msg', 'hi')
  const msg = await storage.read('msg')
  console.log(msg)
}

main().catch(console.error)
```

For more information:

- have a look at the [demo](demo/) folder or
- dive straight into the [documentation](src/storage/docs/Storage.md).

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
