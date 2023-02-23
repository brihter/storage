# @brighter/storage

A cloud agnostic JavaScript object storage library that's built with simplicity and local development in mind.

It offers:

- a unified storage interface (for seamless switching between providers),
- a local storage provider implementation (enabling local development) and
- a simple, concise API.

## Why

Most of today's software talks directly to the cloud, even in local environments. This [extends the feedback loop](https://twitter.com/kentbeck/status/531964254946328576) and creates a [storage provider dependency](https://www.cloudflare.com/learning/cloud/what-is-vendor-lock-in/).

This library offers a different approach.

It introduces a unified storage interface that enables seamless switching between providers and a local storage provider implementation that shortens the feedback loop and maximizes velocity during development.

It's API is easy to use and remember. It removes away the complexity of manually passing around continuation tokens, promise throttling, dealing with various different content encodings and presigning requests.

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
- dive straight into the [documentation](src/storage/docs/Storage.md).

## Providers

List of supported object storage providers:

* [@brighter/storage-adapter-local](src/storage-adapter-local/) and
* [@brighter/storage-adapter-s3](src/storage-adapter-s3/) (AWS S3, Cloudflare R2, DigitalOcean Spaces, ...).

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
