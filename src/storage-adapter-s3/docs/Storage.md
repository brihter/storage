
# Storage


Creates the storage.

## Index


Constructors:

- [Storage(config, clientConfig)](#storageconfig-config-clientconfig-s3clientconfig)




## Constructors

- `Storage(config: Config, clientConfig: S3ClientConfig): StorageInterface`


#### Storage(config: Config, clientConfig: S3ClientConfig)

Parameters:

- `config: Config` - Storage configuration.
- `clientConfig: S3ClientConfig` - Storage client configuration. For more information see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html.

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