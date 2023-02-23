
# Storage


Creates the storage.

## Index


Constructors:

- [Storage(config, configClient)](#storageconfig-config-configclient-s3configclient)




## Constructors

- `Storage(config: Config, configClient: S3ConfigClient): StorageInterface`


#### Storage(config: Config, configClient: S3ConfigClient)

Parameters:

- `config: Config` - Storage configuration.
- `configClient: S3ConfigClient` - Storage client configuration. See: [S3ConfigClient](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html).

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