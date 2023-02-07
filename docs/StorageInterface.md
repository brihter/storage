
# StorageInterface


Storage interface returned by the `Storage()` function.

## Index



Properties:

- [config](#config-configstorage)


Methods:

- [copy](#copy)
- [exists](#exists)
- [list](#list)
- [read](#read)
- [remove](#remove)
- [stat](#stat)
- [write](#write)


## Properties

- `config: ConfigStorage`


#### config: ConfigStorage



See: [ConfigStorage](ConfigStorage.md)




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
const storage = Storage({
  storage: {
    type: 'local',
    path: '/tmp/storage'
  }
})

await storage.write('file', 'hi')
await storage.copy('file', 'file-copy')
await storage.remove('file-copy')

let data
data = await storage.stat('file')

data = await storage.exists('file')
data = await storage.list('/', { recursive: true })
data = await storage.read('file')
```