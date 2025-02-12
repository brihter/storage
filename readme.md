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

*Note: Before installing, Node.js 18 or higher is required.*

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
await storage.read('info.log')
await storage.write('info.log', 'hello')
await storage.remove('info.log')
await storage.exists('info.log')
await storage.stat('info.log')
await storage.copy('info.log', 'info.copy.log')
await storage.list('/')
await storage.presign('info.log')
```

See [StorageInterface](src/storage/docs/StorageInterface.md) for more information.

## Reading From Storage

To retrieve data from object storage, use the `read()` function, providing the file path of the desired object as the first argument and optionally specifying an encoding like `ascii` or `binary` in the second argument.

```js
let data = await storage.read('file')
let data = await storage.read('file', { encoding: 'ascii' })
let data = await storage.read('image.bin', { encoding: 'binary' })
```

See the [ReadFunction](src/storage/docs/ReadFunction.md) for more information.

## Writing To Storage

To write data to object storage, use the `write()` function, specifying the desired file path as the first argument, the content to write (which can be a `string` or a `Buffer`) as the second, and optionally an encoding option like `utf8` or `binary` in the third argument.

```js
await storage.write('msg.txt', 'hello')
await storage.write('msg.txt', 'Ω', { encoding: 'utf8' })
await storage.write('msg.txt', Buffer.alloc(4), { encoding: 'binary' })
```
See the [WriteFunction](src/storage/docs/WriteFunction.md) for more information.

## Removing From Storage

To delete objects from storage, use the `remove()` function, providing the file or directory path to be deleted as the first argument. For directory removal, include the option `{ recursive: true }` in the second argument. Additionally, add the concurrency option, such as `{ concurrency: 10 }`, to control the parallelism.

```js
await storage.remove('file')
await storage.remove('dir/', { recursive: true })
await storage.remove('dir/', { recursive: true, concurrency: 10 })
```

See the [RemoveFunction](src/storage/docs/RemoveFunction.md) for more information.

## Listing Objects

To retrieve a list of objects within a specified path, use the `list()` function. The function requires the directory path as the first argument. Optional configuration can be provided as the second argument in an options object. It can include parameters such as `recursive` to enable listing of subdirectories, `absolute` to return absolute paths, and `concurrency` to adjust the parallelism of the listing operation.

```js
let data = await storage.list('/')
let data = await storage.list('/', { recursive: true })
let data = await storage.list('/', { recursive: true, absolute: true })
let data = await storage.list('/', { recursive: true, absolute: true, concurrency: 10 })
```

See the [ListFunction](src/storage/docs/ListFunction.md) for more information.

## Copying Objects

To copy objects within object storage, use the `copy()` function. This function takes two arguments: the source `path` to copy from and the destination `path` to copy to. It recursively copies files and directories from the source to the destination.

```js
await storage.copy('file', 'file_copy')
await storage.copy('dir/', 'dir_copy/')
```

See the [CopyFunction](src/storage/docs/CopyFunction.md) for more information.

## Presigning URLs

To create a shareable link, use the `presign()` function. This generates a pre-signed URL for a specific file path. By default, these URLs are valid for a limited time, but you can customize the expiration using the `expiresIn` option to control how long the URL remains active. This is particularly useful when you need to grant temporary access to users for file operations without requiring them to authenticate through your application.

```js
let data = await storage.presign('file')
let data = await storage.presign('file', { expiresIn: 3600 })
```

See the [PreSignFunction](src/storage/docs/PreSignFunction.md) for more information.

## Verifying Object Existence

To determine if an object exists at a specific path within object storage, use the `exists()` function. This function takes the path to the object as its sole argument and returns a Promise that resolves to a boolean value, indicating the presence (`true`) or absence (`false`) of an object at the specified location.

```js
let data = await storage.exists('file')
let data = await storage.exists('dir/')
```

See the [ExistsFunction](src/storage/docs/ExistsFunction.md) for more information.

## Retrieving Object Metadata

To retrieve metadata for an object in object storage, use the `stat()` function. This function takes the path to the object and returns an object containing metadata about the object.

```js
let data = await storage.stat('file')
```

See the [StatFunction](src/storage/docs/StatFunction.md) for more information.

## Local Development

Storage can be created so that the code automatically switches between the providers depending on the environment.

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

The library is actively tested against the following object storage providers:

- Local Provider
- [AWS S3](https://aws.amazon.com/s3/)
- [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/)
- [Hetzner Object Storage](https://www.hetzner.com/storage/object-storage/)

## Sponsors

`@brighter/storage` is an MIT-licensed open source project with its ongoing development made possible by the support of the following sponsors:

- [Hetzner](https://www.hetzner.com/)

If you'd like to join them, please consider [sponsoring the development](https://github.com/sponsors/brihter).

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
