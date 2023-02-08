
# Storage


Creates the storage.

## Index


Constructors:

- [Storage(config, dependencies)](#storageconfig-config-dependencies-dependencies)




## Constructors

- `Storage(config: Config, dependencies: Dependencies): StorageInterface`


#### Storage(config: Config, dependencies: Dependencies)

Parameters:

- `config: Config`
- `dependencies: Dependencies`

See: [Config](Config.md), [Dependencies](Dependencies.md)

Returns:

- `StorageInterface`

See: [StorageInterface](StorageInterface.md)

## Examples

```js
const config = {
  type: 's3',
  path: 'bucket-3d8e8dd/path/to/data'
}

const dependencies = {
  client: S3,
  clientInstance: new S3.S3Client({ region: 'eu-central-1' })
}

const storage = Storage(config, dependencies)
```