
# Storage


Creates the storage.

## Index


Constructors:

- [Storage(config, dependencies)](#storageconfig-config-dependencies-dependencies)
- [Storage(config, clientConfig)](#storageconfig-config-clientconfig-s3clientconfig)




## Constructors

- `Storage(config: Config, dependencies: Dependencies): StorageInterface`
- `Storage(config: Config, clientConfig: S3ClientConfig): StorageInterface`


#### Storage(config: Config, dependencies: Dependencies)

Parameters:

- `config: Config`
- `dependencies: Dependencies`

See: [Config](Config.md), [Dependencies](Dependencies.md)

Returns:

- `StorageInterface`

See: [StorageInterface](StorageInterface.md)


#### Storage(config: Config, clientConfig: S3ClientConfig)

Parameters:

- `config: Config`
- `clientConfig: S3ClientConfig`

See: [Config](Config.md)

Returns:

- `StorageInterface`

See: [StorageInterface](StorageInterface.md)

## Examples

```js
import S3 from '@aws-sdk/client-s3'
import S3Presign from '@aws-sdk/s3-request-presigner'

const config = {
  type: 's3',
  path: 'bucket-3d8e8dd/path/to/data'
}

const dependencies = {
  client: S3,
  clientPresign: S3Presign,
  clientInstance: new S3.S3Client({ region: 'eu-central-1' })
}

const storage = Storage(config, dependencies)
```
```js
import { Storage } from '@brighter/storage-adapter-s3'

const config = {
  path: 'my-bucket/path/to/data'
}

const clientConfig = {
  region: 'eu-central-1'
}

const storage = Storage(config, clientConfig)
```