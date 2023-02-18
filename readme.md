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

For more information:

- see the [examples](examples/README.md),
- track changes in the [changelog](changelog.md) or
- dive straight into the [documentation](docs/README.md).

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

## API overview

The aim of the API is to be simple and concise so that's easy to use and remember.

Reading:

```js
let data
data = await storage.read('file')
data = await storage.read('file', { encoding: 'ascii' })
data = await storage.read('file.bin', { encoding: 'binary' })
```

See [ReadFunction](docs/ReadFunction.md) for more information.

Writing:

```js
await storage.write('file', 'hi')
await storage.write('file', 'hi', { encoding: 'utf8' })
await storage.write('file', Buffer.alloc(2), { encoding: 'binary' })
```

See [WriteFunction](docs/WriteFunction.md) for more information.

Removing:

```js
await storage.remove('file')
await storage.remove('dir/', { recursive: true })
await storage.remove('dir/', { recursive: true, concurrency: 10 })
```

See [RemoveFunction](docs/RemoveFunction.md) for more information.

Copying:

```js
await storage.copy('file', 'file_copy')
await storage.copy('file', 'dir/')
await storage.copy('dir/', 'dir_copy/')
await storage.copy('dir/', 'dir_copy/', { concurrency: 10 })
```

See [CopyFunction](docs/CopyFunction.md) for more information.

Listing:

```js
let data
data = await storage.list('/')
data = await storage.list('/', { recursive: true })
data = await storage.list('/', { recursive: true, absolute: true })
data = await storage.list('/', { recursive: true, absolute: true, concurrency: 10 })
```

See [ListFunction](docs/ListFunction.md) for more information.

Existence:

```js
let data
data = await storage.exists('file')
data = await storage.exists('dir/')
```

See [ExistsFunction](docs/ExistsFunction.md) for more information.

File Information:

```js
let data
data = await storage.stat('file')
```

See [StatFunction](docs/StatFunction.md) for more information.

## Roadmap

- `v1.3.0` Convert the library to ECMAScript modules.
- `v1.4.0` Create the `@brighter/storage-s3` package that comes prebundled with required S3 dependencies.
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
