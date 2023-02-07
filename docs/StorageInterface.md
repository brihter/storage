
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
- [uri](#uri)
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
- `uri: URIFunction`
- `write: WriteFunction`


#### copy: CopyFunction



See: [CopyFunction](CopyFunction.md)




#### exists: ExistsFunction



See: [ExistsFunction](ExistsFunction.md)




#### list: ListFunction



See: [ListFunction](ListFunction.md)




#### read: ReadFunction



See: [ReadFunction](ReadFunction.md)




#### remove: RemoveFunction



See: [RemoveFunction](RemoveFunction.md)




#### stat: StatFunction



See: [StatFunction](StatFunction.md)




#### uri: URIFunction



See: [URIFunction](URIFunction.md)




#### write: WriteFunction



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
data = await storage.uri('file')
data = await storage.exists('file')
data = await storage.list('/', { recursive: true })
data = await storage.read('file')
```