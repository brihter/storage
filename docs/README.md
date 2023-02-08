
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

# StorageInterface


Storage interface returned by the `Storage()` function.

## Index



Properties:

- [config](#config-config)


Methods:

- [copy](#copy)
- [exists](#exists)
- [list](#list)
- [read](#read)
- [remove](#remove)
- [stat](#stat)
- [write](#write)


## Properties

- `config: Config`


#### config: Config



See: [Config](Config.md)




## Methods

- `copy: CopyFunction`
- `exists: ExistsFunction`
- `list: ListFunction`
- `read: ReadFunction`
- `remove: RemoveFunction`
- `stat: StatFunction`
- `write: WriteFunction`


#### copy: CopyFunction

Recursively copies the contents from source to destination.

See: [CopyFunction](CopyFunction.md)




#### exists: ExistsFunction

Checks if a file exists.

See: [ExistsFunction](ExistsFunction.md)




#### list: ListFunction

Reads the contents of a directory.

See: [ListFunction](ListFunction.md)




#### read: ReadFunction

Reads the contents of a file.

See: [ReadFunction](ReadFunction.md)




#### remove: RemoveFunction

Removes the file.

See: [RemoveFunction](RemoveFunction.md)




#### stat: StatFunction

Returns the file information.

See: [StatFunction](StatFunction.md)




#### write: WriteFunction

Writes data to a file, replacing the file if it already exists.

See: [WriteFunction](WriteFunction.md)



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

await storage.write('file', 'hi')
await storage.copy('file', 'file-copy')
await storage.remove('file-copy')

let data
data = await storage.stat('file')
data = await storage.exists('file')
data = await storage.list('/', { recursive: true })
data = await storage.read('file')
```