
# Storage


Creates the storage.

## Index


Constructors:

- [Storage(config, clientConfig)](#storageconfig-config-clientconfig-s3clientconfig)




## Constructors

- `Storage(config: Config, clientConfig: S3ClientConfig): StorageInterface`


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
import { Storage } from '@brighter/storage-adapter-s3'

const config = {
  path: 'my-bucket/path/to/data'
}

const clientConfig = {
  region: 'eu-central-1'
}

const storage = Storage(config, clientConfig)
```