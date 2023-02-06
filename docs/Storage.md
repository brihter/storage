
# Storage


Creates the storage provider.

## Index


Constructors:

- [Storage(config)](#storageconfig-config)




## Constructors

- `Storage(config: Config): StorageInterface`


#### Storage(config: Config)

Parameters:

- `config: Config`

See: [Config](Config.md)

Returns:

- `StorageInterface`

See: [StorageInterface](StorageInterface.md)

## Examples

```js
const storage = Storage({
  storage: {
    type: 's3',
    path: 'my-bucket'
  },
  storageClient: {
    region: 'eu-central-1'
  }
})
```