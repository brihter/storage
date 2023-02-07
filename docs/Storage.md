
# Storage


Creates the storage.

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
    type: 'local',
    path: '/tmp/storage'
  }
})
```