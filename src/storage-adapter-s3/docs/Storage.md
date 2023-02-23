
# Storage


Creates the storage.

## Index


Constructors:

- [Storage(config, configClient)](#storageconfig-config-configclient-s3clientconfig)




## Constructors

- `Storage(config: Config, configClient: S3ClientConfig): StorageInterface`


#### Storage(config: Config, configClient: S3ClientConfig)

Parameters:

- `config: Config` - Storage configuration.
- `configClient: S3ClientConfig` - Storage client configuration. See: [S3ClientConfig](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html).

See: [Config](Config.md)

Returns:

- `StorageInterface`

See: [StorageInterface](StorageInterface.md)

## Examples

```js
const config = {
  path: 'my-bucket/path/to/data'
}

const configClient = {
  region: 'eu-central-1'
}

const storage = Storage(config, configClient)
```